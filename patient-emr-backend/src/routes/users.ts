import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  adminResetPassword,
  deactivateUser,
  activateUser,
} from '../controllers/userController';
import { authenticate, adminOnly } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Admin-only routes
router.post('/', adminOnly, createUser);
router.get('/', adminOnly, getUsers);
router.post('/:id/reset-password', adminOnly, adminResetPassword);
router.post('/:id/deactivate', adminOnly, deactivateUser);
router.post('/:id/activate', adminOnly, activateUser);

// Admin or self
router.get('/:id', getUserById);
router.put('/:id', updateUser);

export default router;
