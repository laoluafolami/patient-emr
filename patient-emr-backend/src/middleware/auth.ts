import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserRole } from '@prisma/client';
import prisma from '../lib/prisma';
import { ApiError } from './errorHandler';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

/**
 * Middleware: Verify JWT token and attach user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required. Please log in.');
    }

    const token = authHeader.substring(7);

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err: any) {
      if (err.message === 'TOKEN_EXPIRED') {
        throw new ApiError(401, 'Your session has expired. Please log in again.');
      }
      throw new ApiError(401, 'Invalid authentication token.');
    }

    // Check if session exists and is valid
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: { select: { id: true, email: true, role: true, status: true } } },
    });

    if (!session) {
      throw new ApiError(401, 'Session not found. Please log in again.');
    }

    if (new Date() > session.expiresAt) {
      // Clean up expired session
      await prisma.session.delete({ where: { id: session.id } });
      throw new ApiError(401, 'Your session has expired. Please log in again.');
    }

    if (session.user.status !== 'ACTIVE') {
      throw new ApiError(403, 'Your account has been deactivated. Please contact your administrator.');
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware: Require specific roles
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, 'Authentication required.'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, 'You do not have permission to access this resource.'));
      return;
    }

    next();
  };
};

/**
 * Middleware: Admin only
 */
export const adminOnly = authorize(UserRole.ADMIN);

/**
 * Middleware: Doctor only
 */
export const doctorOnly = authorize(UserRole.DOCTOR);

/**
 * Middleware: Nurse only
 */
export const nurseOnly = authorize(UserRole.NURSE);

/**
 * Middleware: Patient only
 */
export const patientOnly = authorize(UserRole.PATIENT);

/**
 * Middleware: Doctor or Nurse
 */
export const medicalStaff = authorize(UserRole.DOCTOR, UserRole.NURSE);

/**
 * Middleware: All staff (not patient)
 */
export const staffOnly = authorize(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN);
