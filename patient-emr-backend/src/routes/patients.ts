import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticate, medicalStaff, adminOnly } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// Doctors and nurses can list patients
router.get('/', medicalStaff, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string | undefined;
    const limit = parseInt(req.query.limit as string || '100', 10);

    const where: any = { role: 'PATIENT', status: 'ACTIVE' };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const patients = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        createdAt: true,
        patientProfile: {
          select: {
            patientId: true,
            bloodType: true,
            allergies: true,
          },
        },
      },
      orderBy: { firstName: 'asc' },
      take: limit,
    });

    res.json({ success: true, data: { patients } });
  } catch (error) {
    next(error);
  }
});

export default router;
