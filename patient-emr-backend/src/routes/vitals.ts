import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticate, medicalStaff } from '../middleware/auth';
import { logActivity } from '../middleware/activityLogger';

const router = Router();
router.use(authenticate, medicalStaff);

// POST /api/vitals — record vital signs
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId, temperature, systolicBP, diastolicBP, heartRate, respiratoryRate, oxygenSaturation, weight, height, notes } = req.body;

    if (!patientId) {
      res.status(400).json({ success: false, message: 'Patient ID is required.' });
      return;
    }

    // Find patient profile
    const patient = await prisma.user.findUnique({
      where: { id: patientId },
      include: { patientProfile: true },
    });

    if (!patient?.patientProfile) {
      res.status(404).json({ success: false, message: 'Patient not found.' });
      return;
    }

    // Find nurse profile
    const nurseProfile = await prisma.nurseProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    const vital = await prisma.vitalSign.create({
      data: {
        patientProfileId: patient.patientProfile.id,
        nurseProfileId: nurseProfile?.id || null,
        temperature: temperature ? parseFloat(temperature) : null,
        systolicBP: systolicBP ? parseInt(systolicBP) : null,
        diastolicBP: diastolicBP ? parseInt(diastolicBP) : null,
        heartRate: heartRate ? parseInt(heartRate) : null,
        respiratoryRate: respiratoryRate ? parseInt(respiratoryRate) : null,
        oxygenSaturation: oxygenSaturation ? parseFloat(oxygenSaturation) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        notes: notes || null,
      },
    });

    await logActivity(req.user!.userId, 'VITALS_RECORDED', 'vitals', vital.id, { patientId }, req);

    res.status(201).json({ success: true, message: 'Vital signs recorded successfully.', data: { vital } });
  } catch (error) {
    next(error);
  }
});

// GET /api/vitals?patientId=xxx — get vitals for a patient
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId } = req.query;

    const where: any = {};
    if (patientId) {
      const patient = await prisma.user.findUnique({
        where: { id: patientId as string },
        include: { patientProfile: true },
      });
      if (patient?.patientProfile) {
        where.patientProfileId = patient.patientProfile.id;
      }
    }

    const vitals = await prisma.vitalSign.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 50,
      include: {
        patientProfile: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    res.json({ success: true, data: { vitals } });
  } catch (error) {
    next(error);
  }
});

export default router;
