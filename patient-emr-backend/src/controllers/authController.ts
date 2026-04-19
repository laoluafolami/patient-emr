import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { UserRole as PrismaUserRole } from '@prisma/client';
import prisma from '../lib/prisma';
import { generateToken, generateSecureToken, getTokenExpiry } from '../utils/jwt';
import { validateEmail, validatePassword, sanitizeString } from '../utils/validation';
import { sendEmail, emailTemplates } from '../utils/email';
import { ApiError } from '../middleware/errorHandler';
import { logActivity } from '../middleware/activityLogger';

const SESSION_DURATION_HOURS = 8; // 8-hour sessions

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required.');
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      throw new ApiError(400, emailValidation.message || 'Invalid email format.');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      // Generic message to prevent user enumeration
      throw new ApiError(401, 'Invalid email or password.');
    }

    // Check account status
    if (user.status === 'INACTIVE') {
      throw new ApiError(403, 'Your account has been deactivated. Please contact your administrator.');
    }

    if (user.status === 'SUSPENDED') {
      throw new ApiError(403, 'Your account has been suspended. Please contact your administrator.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await logActivity(undefined, 'LOGIN_FAILED', 'auth', user.id, { email: user.email }, req);
      throw new ApiError(401, 'Invalid email or password.');
    }

    // Invalidate any existing sessions for this user (single session enforcement)
    await prisma.session.deleteMany({ where: { userId: user.id } });

    // Create new session
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as PrismaUserRole,
    });

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    // Log successful login
    await logActivity(user.id, 'LOGIN_SUCCESS', 'auth', user.id, { role: user.role }, req);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        expiresAt,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Invalidate the current session
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await prisma.session.deleteMany({ where: { token } });
    }

    if (req.user) {
      await logActivity(req.user.userId, 'LOGOUT', 'auth', req.user.userId, undefined, req);
    }

    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, 'Email address is required.');
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      throw new ApiError(400, emailValidation.message || 'Invalid email format.');
    }

    // Always return success to prevent user enumeration
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (user && user.status === 'ACTIVE') {
      const resetToken = generateSecureToken();
      const resetTokenExpiry = getTokenExpiry(24); // 24 hours

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      const template = emailTemplates.passwordReset(user.firstName, resetUrl);

      await sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      await logActivity(user.id, 'PASSWORD_RESET_REQUESTED', 'auth', user.id, undefined, req);
    }

    // Always return the same response
    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/reset-password
 * Reset password using token
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      throw new ApiError(400, 'Reset token is required.');
    }

    if (!password) {
      throw new ApiError(400, 'New password is required.');
    }

    if (password !== confirmPassword) {
      throw new ApiError(400, 'Passwords do not match.');
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new ApiError(400, 'Password does not meet requirements.', {
        errors: passwordValidation.errors,
      });
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new ApiError(400, 'This reset link is invalid or has expired. Please request a new one.');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // Invalidate all sessions
    await prisma.session.deleteMany({ where: { userId: user.id } });

    // Send confirmation email
    const template = emailTemplates.passwordChanged(user.firstName);
    await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    await logActivity(user.id, 'PASSWORD_RESET_SUCCESS', 'auth', user.id, undefined, req);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated.');
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
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
        patientProfile: { select: { patientId: true } },
        doctorProfile: { select: { doctorId: true, specialization: true, department: true } },
        nurseProfile: { select: { nurseId: true, department: true } },
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
 * POST /api/auth/change-password
 * Change password for authenticated user
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated.');
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new ApiError(400, 'All password fields are required.');
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError(400, 'New passwords do not match.');
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new ApiError(400, 'New password does not meet requirements.', {
        errors: passwordValidation.errors,
      });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new ApiError(400, 'Current password is incorrect.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await logActivity(user.id, 'PASSWORD_CHANGED', 'auth', user.id, undefined, req);

    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};
