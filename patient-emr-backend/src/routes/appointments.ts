import { Router } from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAvailableDoctors,
} from '../controllers/appointmentController';
import { authenticate, patientOnly, doctorOnly, staffOnly } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get available doctors (all authenticated users)
router.get('/doctors/available', getAvailableDoctors);

// Create appointment (patients only)
router.post('/', patientOnly, createAppointment);

// Get appointments (filtered by role)
router.get('/', getAppointments);

// Get appointment by ID
router.get('/:id', getAppointmentById);

// Update appointment
router.patch('/:id', updateAppointment);

// Cancel appointment
router.delete('/:id', deleteAppointment);

export default router;
