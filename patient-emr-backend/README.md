# Patient EMR System - Backend API

A secure, role-based Electronic Medical Records (EMR) system backend built with Node.js, Express, and TypeScript.

## Overview

This backend API provides secure endpoints for managing patient records, appointments, consultations, and administrative functions. The system implements role-based access control (RBAC) for four user types: Patients, Nurses, Doctors, and Administrators.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 4.18+
- **Language**: TypeScript 5.3+
- **Database**: PostgreSQL (with Prisma ORM - to be configured)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs
- **Logging**: Morgan
- **Testing**: Jest with ts-jest
- **Code Quality**: ESLint, Prettier

## Project Structure

```
patient-emr-backend/
├── src/
│   ├── index.ts                 # Main application entry point
│   ├── config/
│   │   └── environment.ts       # Environment configuration
│   ├── middleware/
│   │   ├── errorHandler.ts      # Error handling middleware
│   │   └── requestLogger.ts     # Request logging middleware
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── routes/                  # API route handlers (to be implemented)
│   ├── controllers/             # Business logic (to be implemented)
│   ├── services/                # Service layer (to be implemented)
│   └── utils/                   # Utility functions (to be implemented)
├── dist/                        # Compiled JavaScript output
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── .eslintrc.json              # ESLint configuration
├── .prettierrc.json            # Prettier configuration
├── jest.config.js              # Jest testing configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies
└── README.md                   # This file
```

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- PostgreSQL 12 or higher (for database)

### Setup Steps

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd patient-emr-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: A strong secret key for JWT signing
   - `CORS_ORIGIN`: Frontend URL (default: http://localhost:3000)
   - `PORT`: Server port (default: 3001)

4. **Verify configuration**
   ```bash
   npm run build
   ```

## Running the Server

### Development Mode

Start the server with hot-reload using ts-node:

```bash
npm run dev
```

The server will start on `http://localhost:3001` (or the port specified in `.env`)

### Production Mode

Build and run the compiled JavaScript:

```bash
npm run build
npm start
```

### Health Check

Verify the server is running:

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456
}
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/production/test) | development | No |
| `PORT` | Server port | 3001 | No |
| `API_URL` | API base URL | http://localhost:3001 | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRATION` | JWT token expiration time | 24h | No |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 | No |
| `LOG_LEVEL` | Logging level (info/debug/error) | info | No |
| `SESSION_TIMEOUT` | Session timeout in milliseconds | 1800000 (30 min) | No |

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication (To be implemented)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### Users (To be implemented)
- `GET /api/users` - List all users (admin only)
- `POST /api/users` - Create new user (admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user (admin only)

### Appointments (To be implemented)
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

## Middleware

### Security Middleware
- **Helmet**: Adds security headers to prevent common vulnerabilities
- **CORS**: Handles cross-origin requests from the frontend
- **Body Parser**: Parses JSON request bodies (max 10MB)

### Logging Middleware
- **Morgan**: Logs HTTP requests with method, path, status, and response time
- **Custom Logger**: Tracks request IDs for debugging

### Error Handling
- **Global Error Handler**: Catches and formats all errors consistently
- **Async Error Wrapper**: Handles errors in async route handlers
- **404 Handler**: Returns proper error for undefined routes

## Development

### Code Quality

Run linting:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Security Features

1. **Password Security**: Passwords are hashed using bcryptjs
2. **JWT Authentication**: Secure token-based authentication
3. **CORS Protection**: Restricted cross-origin requests
4. **Helmet Security Headers**: Protection against common vulnerabilities
5. **Input Validation**: Validates all user inputs (to be implemented)
6. **SQL Injection Prevention**: Uses parameterized queries with Prisma ORM
7. **Rate Limiting**: To be implemented for API endpoints
8. **Session Management**: Secure session handling with timeouts

## Database

The backend uses PostgreSQL with Prisma ORM for database operations.

### Database Setup (To be implemented in Task 1.3)

1. Create PostgreSQL database
2. Configure Prisma schema
3. Run migrations
4. Seed initial data

## Deployment

### Development Deployment (Render)

1. Connect Git repository to Render
2. Set environment variables in Render dashboard
3. Configure build command: `npm run build`
4. Configure start command: `npm start`

### Production Deployment (Hostinger)

1. Set up Node.js environment on Hostinger
2. Configure PostgreSQL database
3. Set environment variables
4. Deploy application
5. Configure SSL/TLS certificates
6. Set up monitoring and backups

## Monitoring & Logging

- **Request Logging**: All HTTP requests logged with Morgan
- **Error Logging**: All errors logged to console (to be extended with Sentry)
- **Health Monitoring**: Health check endpoint for uptime monitoring
- **Performance Monitoring**: Response times tracked (to be extended with New Relic)

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## Code Style

- **Language**: TypeScript with strict mode enabled
- **Formatting**: Prettier (2-space indentation)
- **Linting**: ESLint with TypeScript support
- **Naming**: camelCase for variables/functions, PascalCase for classes/types

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env or use:
PORT=3002 npm run dev
```

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists and credentials are correct

### JWT Secret Not Set
- Set JWT_SECRET in .env file
- Use a strong, random string (minimum 32 characters)

## Next Steps

1. **Task 1.3**: Set up PostgreSQL database schema with Prisma ORM
2. **Task 1.4**: Configure Git repository with proper structure
3. **Task 1.5**: Set up testing infrastructure
4. **Phase 3**: Implement authentication endpoints
5. **Phase 4**: Implement user management endpoints
6. **Phase 5**: Implement appointment management endpoints

## Support

For issues or questions, please refer to the project documentation or contact the development team.

## License

MIT License - See LICENSE file for details
