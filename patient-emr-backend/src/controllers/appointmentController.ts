import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { ApiError } from '../middleware/errorHandler';
import { AppointmentStatus } from '@prisma/client';

/**
 * POST /api/appointments
 * Create a new appointment
 */
export const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { doctorId, scheduledAt, duration, reason, notes } = req.body;
    const patientId = req.user!.userId;

    // Validate required fields
    if (!doctorId || !scheduledAt) {
      throw new ApiError(400, 'Doctor ID and scheduled time are required');
    }

    // Check if doctor exists and has doctor role
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: true },
    });

    if (!doctor || doctor.role !== 'DOCTOR') {
      throw new ApiError(404, 'Doctor not found');
    }

    // Check if patient exists
    const patient = await prisma.user.findUnique({
      where: { id: patientId },
      include: { patientProfile: true },
    });

    if (!patient || patient.role !== 'PATIENT') {
      throw new ApiError(404, 'Patient not found');
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 30,
        reason,
        notes,
        status: AppointmentStatus.SCHEDULED,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            doctorProfile: {
              select: {
                specialization: true,
                department: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/appointments
 * Get appointments (filtered by role)
 */
export const getAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const { status, startDate, endDate } = req.query;

    let whereClause: any = {};

    // Filter by role
    if (userRole === 'PATIENT') {
      whereClause.patientId = userId;
    } else if (userRole === 'DOCTOR') {
      whereClause.doctorId = userId;
    } else if (userRole === 'ADMIN' || userRole === 'NURSE') {
      // Admin and nurses can see all appointments
    } else {
      throw new ApiError(403, 'Unauthorized to view appointments');
    }

    // Filter by status
    if (status) {
      whereClause.status = status as AppointmentStatus;
    }

    // Filter by date range
    if (startDate || endDate) {
      whereClause.scheduledAt = {};
      if (startDate) {
        whereClause.scheduledAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        whereClause.scheduledAt.lte = new Date(endDate as string);
      }
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            doctorProfile: {
              select: {
                specialization: true,
                department: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/appointments/:id
 * Get appointment by ID
 */
export const getAppointmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            patientProfile: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            doctorProfile: true,
          },
        },
        consultation: true,
      },
    });

    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    // Check authorization
    if (
      userRole !== 'ADMIN' &&
      userRole !== 'NURSE' &&
      appointment.patientId !== userId &&
      appointment.doctorId !== userId
    ) {
      throw new ApiError(403, 'You do not have permission to view this appointment');
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/appointments/:id
 * Update appointment
 */
export const updateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const { scheduledAt, duration, status, reason, notes } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    // Check authorization
    const canUpdate =
      userRole === 'ADMIN' ||
      userRole === 'NURSE' ||
      appointment.patientId === userId ||
      appointment.doctorId === userId;

    if (!canUpdate) {
      throw new ApiError(403, 'You do not have permission to update this appointment');
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
        ...(duration && { duration }),
        ...(status && { status }),
        ...(reason !== undefined && { reason }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            doctorProfile: {
              select: {
                specialization: true,
                department: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: updatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/appointments/:id
 * Cancel/delete appointment
 */
export const deleteAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    // Check authorization
    const canDelete =
      userRole === 'ADMIN' ||
      appointment.patientId === userId ||
      appointment.doctorId === userId;

    if (!canDelete) {
      throw new ApiError(403, 'You do not have permission to cancel this appointment');
    }

    // Instead of deleting, mark as cancelled
    await prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CANCELLED },
    });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/appointments/doctors/available
 * Get available doctors for appointments
 */
export const getAvailableDoctors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: 'DOCTOR',
        status: 'ACTIVE',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        doctorProfile: {
          select: {
            specialization: true,
            department: true,
            licenseNumber: true,
          },
        },
      },
      orderBy: {
        lastName: 'asc',
      },
    });

    res.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};
