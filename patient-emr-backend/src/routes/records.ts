import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticate, medicalStaff } from '../middleware/auth';
import { logActivity } from '../middleware/activityLogger';

const router = Router();
router.use(authenticate, medicalStaff);

// POST /api/records — create patient record
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId, chiefComplaint, symptoms, observations, notes } = req.body;

    if (!patientId || !chiefComplaint) {
      res.status(400).json({ success: false, message: 'Patient ID and chief complaint are required.' });
      return;
    }

    const patient = await prisma.user.findUnique({
      where: { id: patientId },
      include: { patientProfile: true },
    });

    if (!patient?.patientProfile) {
      res.status(404).json({ success: false, message: 'Patient not found.' });
      return;
    }

    const nurseProfile = await prisma.nurseProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    const record = await prisma.patientRecord.create({
      data: {
        patientProfileId: patient.patientProfile.id,
        nurseProfileId: nurseProfile?.id || null,
        chiefComplaint,
        symptoms: symptoms || null,
        observations: observations || null,
        notes: notes || null,
      },
    });

    await logActivity(req.user!.userId, 'RECORD_CREATED', 'patient_records', record.id, { patientId }, req);

    res.status(201).json({ success: true, message: 'Patient record saved successfully.', data: { record } });
  } catch (error) {
    next(error);
  }
});

// GET /api/records — get recent records
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

    const records = await prisma.patientRecord.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 20,
      include: {
        patientProfile: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    res.json({ success: true, data: { records } });
  } catch (error) {
    next(error);
  }
});

export default router;
