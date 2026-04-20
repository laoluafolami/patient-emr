import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

/**
 * Get the real client IP address, accounting for proxies
 */
const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; take the first (original client)
    const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return ips.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
};

/**
 * Log user activity to the database
 */
export const logActivity = async (
  userId: string | undefined,
  action: string,
  resource?: string,
  resourceId?: string,
  details?: Record<string, any>,
  req?: Request
): Promise<void> => {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId || null,
        action,
        resource: resource || null,
        resourceId: resourceId || null,
        details: details ? JSON.stringify(details) : null,
        ipAddress: req ? getClientIp(req) : null,
        userAgent: req?.headers['user-agent'] || null,
      },
    });
  } catch (error) {
    // Don't let logging failures break the app
    console.error('Activity log error:', error);
  }
};

/**
 * Middleware: Auto-log all authenticated requests
 */
export const activityLogMiddleware = (action: string, resource?: string) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (req.user) {
      await logActivity(req.user.userId, action, resource, req.params.id, undefined, req);
    }
    next();
  };
};
