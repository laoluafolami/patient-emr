import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticate, adminOnly } from '../middleware/auth';

const router = Router();

router.use(authenticate, adminOnly);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string || '50', 10);
    const offset = parseInt(req.query.offset as string || '0', 10);

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: { select: { firstName: true, lastName: true, role: true } },
        },
      }),
      prisma.activityLog.count(),
    ]);

    res.json({ success: true, data: { logs, total } });
  } catch (error) {
    next(error);
  }
});

export default router;
