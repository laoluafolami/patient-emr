import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { UserRole as PrismaUserRole } from '@prisma/client';
import prisma from '../lib/prisma';
import { validateEmail, validatePassword, validateName, sanitizeString } from '../utils/validation';
import { generateSecureToken } from '../utils/jwt';
import { sendEmail, emailTemplates } from '../utils/email';
import { ApiError } from '../middleware/errorHandler';
import { logActivity } from '../middleware/activityLogger';

/**
 * POST /api/users
 * Admin: Create a new user account
 */
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, firstName, lastName, role, phone, dateOfBirth } = req.body;

    // Validate required fields
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      throw new ApiError(400, emailValidation.message || 'Invalid email.');
    }

    const firstNameValidation = validateName(firstName, 'First name');
    if (!firstNameValidation.valid) {
      throw new ApiError(400, firstNameValidation.message || 'Invalid first name.');
    }

    const lastNameValidation = validateName(lastName, 'Last name');
    if (!lastNameValidation.valid) {
      throw new ApiError(400, lastNameValidation.message || 'Invalid last name.');
    }

    const validRoles = ['PATIENT', 'NURSE', 'DOCTOR', 'ADMIN'];
    if (!role || !validRoles.includes(role.toUpperCase())) {
      throw new ApiError(400, 'Invalid role. Must be PATIENT, NURSE, DOCTOR, or ADMIN.');
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      throw new ApiError(409, 'An account with this email address already exists.');
    }

    // Generate a temporary password
    const tempPassword = generateSecureToken().substring(0, 12) + 'A1!';
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Create user with role-specific profile
    const normalizedRole = role.toUpperCase() as PrismaUserRole;

    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        firstName: sanitizeString(firstName),
        lastName: sanitizeString(lastName),
        role: normalizedRole,
        phone: phone ? sanitizeString(phone) : null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        createdBy: req.user?.userId,
        // Create role-specific profile
        ...(normalizedRole === PrismaUserRole.PATIENT && {
          patientProfile: { create: {} },
        }),
        ...(normalizedRole === PrismaUserRole.DOCTOR && {
          doctorProfile: { create: {} },
        }),
        ...(normalizedRole === PrismaUserRole.NURSE && {
          nurseProfile: { create: {} },
        }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Send welcome email with credentials
    const template = emailTemplates.welcomeNewUser(
      user.firstName,
      user.email,
      tempPassword,
      user.role.toLowerCase()
    );

    await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    await logActivity(
      req.user?.userId,
      'USER_CREATED',
      'users',
      user.id,
      { createdEmail: user.email, role: user.role },
      req
    );

    res.status(201).json({
      success: true,
      message: `User account created successfully. Login credentials have been sent to ${user.email}.`,
      data: {
        user,
        // Return temp password so admin can share it directly
        tempPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users
 * Admin: Get all users
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role, status, search, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};

    if (role) where.role = (role as string).toUpperCase();
    if (status) where.status = (status as string).toUpperCase();
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          phone: true,
          createdAt: true,
          createdBy: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Get a specific user
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        phone: true,
        dateOfBirth: true,
        createdAt: true,
        patientProfile: true,
        doctorProfile: true,
        nurseProfile: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Admin: Update user details
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, dateOfBirth, status } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    const updateData: any = {};

    if (firstName) {
      const validation = validateName(firstName, 'First name');
      if (!validation.valid) throw new ApiError(400, validation.message!);
      updateData.firstName = sanitizeString(firstName);
    }

    if (lastName) {
      const validation = validateName(lastName, 'Last name');
      if (!validation.valid) throw new ApiError(400, validation.message!);
      updateData.lastName = sanitizeString(lastName);
    }

    if (phone !== undefined) updateData.phone = phone ? sanitizeString(phone) : null;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (status) updateData.status = status.toUpperCase();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        phone: true,
        updatedAt: true,
      },
    });

    await logActivity(req.user?.userId, 'USER_UPDATED', 'users', id, { updatedFields: Object.keys(updateData) }, req);

    res.status(200).json({ success: true, message: 'User updated successfully.', data: { user: updatedUser } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/:id/reset-password
 * Admin: Reset a user's password
 */
export const adminResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    // Generate new temporary password
    const tempPassword = generateSecureToken().substring(0, 12) + 'A1!';
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    // Invalidate all sessions
    await prisma.session.deleteMany({ where: { userId: id } });

    // Send email with new credentials
    const template = emailTemplates.welcomeNewUser(
      user.firstName,
      user.email,
      tempPassword,
      user.role.toLowerCase()
    );

    await sendEmail({
      to: user.email,
      subject: 'Your Password Has Been Reset — Patient EMR System',
      html: template.html,
      text: template.text,
    });

    await logActivity(req.user?.userId, 'ADMIN_PASSWORD_RESET', 'users', id, { targetEmail: user.email }, req);

    res.status(200).json({
      success: true,
      message: `Password reset successfully. New credentials have been sent to ${user.email}.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/:id/deactivate
 * Admin: Deactivate a user account
 */
export const deactivateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.user?.userId === id) {
      throw new ApiError(400, 'You cannot deactivate your own account.');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    await prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    // Invalidate all sessions
    await prisma.session.deleteMany({ where: { userId: id } });

    await logActivity(req.user?.userId, 'USER_DEACTIVATED', 'users', id, { targetEmail: user.email }, req);

    res.status(200).json({ success: true, message: 'User account deactivated successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/:id/activate
 * Admin: Reactivate a user account
 */
export const activateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    await prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    await logActivity(req.user?.userId, 'USER_ACTIVATED', 'users', id, { targetEmail: user.email }, req);

    res.status(200).json({ success: true, message: 'User account activated successfully.' });
  } catch (error) {
    next(error);
  }
};
