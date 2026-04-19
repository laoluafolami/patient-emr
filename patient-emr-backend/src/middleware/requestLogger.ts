import { Request, Response, NextFunction } from 'express';

/**
 * Custom request logging middleware
 * Logs detailed information about each request
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const requestId = generateRequestId();

  // Attach request ID to response headers
  res.setHeader('X-Request-ID', requestId);

  // Log request details
  console.log(`
[${new Date().toISOString()}] Request ID: ${requestId}
Method: ${req.method}
Path: ${req.path}
IP: ${req.ip}
User-Agent: ${req.get('user-agent')}
  `);

  // Capture response details
  const originalSend = res.send;
  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    console.log(`
[${new Date().toISOString()}] Response ID: ${requestId}
Status: ${statusCode}
Duration: ${duration}ms
  `);

    return originalSend.call(this, data);
  };

  next();
};

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
