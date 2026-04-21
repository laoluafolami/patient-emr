import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import activityLogRoutes from './routes/activityLogs';
import patientRoutes from './routes/patients';
import vitalsRoutes from './routes/vitals';
import recordsRoutes from './routes/records';
import appointmentRoutes from './routes/appointments';

// Import middleware
import { errorHandler } from './middleware/errorHandler';

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 3001;

// Trust proxy — required for correct IP detection behind Render/Netlify/etc.
app.set('trust proxy', 1);

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Request logging
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ============================================================================
// API ROUTES
// ============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/appointments', appointmentRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Endpoint ${_req.method} ${_req.path} does not exist`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         Patient EMR System — Backend API                   ║
╚════════════════════════════════════════════════════════════╝

  ✓ Server running on port ${PORT}
  ✓ Environment: ${process.env.NODE_ENV || 'development'}
  ✓ CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}
  ✓ Health check: GET http://localhost:${PORT}/health

  API Endpoints:
  ✓ POST /api/auth/login
  ✓ POST /api/auth/logout
  ✓ POST /api/auth/forgot-password
  ✓ POST /api/auth/reset-password
  ✓ GET  /api/auth/me
  ✓ POST /api/users (admin only)
  ✓ GET  /api/users (admin only)
  ✓ GET  /api/appointments
  ✓ POST /api/appointments (patient only)

  Ready to accept requests...
  `);
});

export default app;
