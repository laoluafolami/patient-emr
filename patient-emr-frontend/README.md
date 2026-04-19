# Patient EMR System - Frontend

A modern, healthcare-focused web application built with React 18, TypeScript, and Tailwind CSS. The system features a stunning clay morphism design with dark/light theme support and role-based access control.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (v20.17.0 or higher recommended)
- npm 8+ or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment variables:
```bash
cp .env.example .env.local
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── buttons/        # Button components (Primary, Secondary, Danger, Icon)
│   ├── inputs/         # Input components (Text, Textarea, Select, Checkbox, Radio)
│   ├── cards/          # Card components (Standard, Patient Record, Vital Signs, Lab Result)
│   ├── badges/         # Badge components (Status, Role)
│   ├── modals/         # Modal and notification components
│   └── layout/         # Layout components (Header, Sidebar, Footer)
├── pages/              # Page components
│   ├── auth/           # Authentication pages (Login, Register, Reset Password)
│   ├── landing/        # Landing page
│   ├── dashboard/      # Role-based dashboards (Patient, Doctor, Nurse, Admin)
│   └── 404/            # Error pages
├── context/            # React Context for global state
│   ├── AuthContext.tsx # Authentication state
│   └── ThemeContext.tsx # Theme state (dark/light mode)
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useTheme.ts     # Theme hook
│   └── useApi.ts       # API call hook
├── services/           # API services
│   ├── authService.ts  # Authentication API calls
│   ├── apiClient.ts    # Axios/Fetch client configuration
│   └── endpoints.ts    # API endpoint definitions
├── utils/              # Utility functions
│   ├── validation.ts   # Input validation utilities
│   ├── formatting.ts   # Data formatting utilities
│   └── constants.ts    # Application constants
├── types/              # TypeScript type definitions
│   ├── auth.ts         # Authentication types
│   ├── user.ts         # User types
│   ├── api.ts          # API response types
│   └── index.ts        # Exported types
├── styles/             # Global styles
│   └── globals.css     # Global CSS
├── App.tsx             # Main App component
├── index.tsx           # React entry point
└── index.css           # Tailwind CSS imports
```

## 🎨 Design System

### Color Palette

#### Light Mode
- **Primary Blue**: `#4A90E2` - Medical trust and professionalism
- **Secondary Green**: `#2ECC71` - Health, healing, and positive outcomes
- **Accent Orange**: `#FF6B6B` - Alerts, important actions, and warnings
- **Neutral Light**: `#F8F9FA` - Background surfaces
- **Neutral Dark**: `#5F6368` - Secondary text

#### Dark Mode
- **Primary Blue**: `#5BA3F5` - Adjusted for dark backgrounds
- **Secondary Green**: `#81C995` - Softer green for dark mode
- **Accent Orange**: `#FF8A80` - Warmer orange for visibility
- **Neutral Dark**: `#1F1F1F` - Primary background
- **Text Primary**: `#FFFFFF` - Main content text

### Spacing System

Consistent 8px base unit:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Border Radius

Clay morphism soft corners:
- `sm`: 8px (small elements)
- `md`: 12px (cards, buttons)
- `lg`: 16px (larger cards)
- `xl`: 24px (hero sections)
- `full`: 9999px (pills, circles)

### Shadows

Elevation system for depth:
- **Elevation 1**: `0 2px 4px rgba(0, 0, 0, 0.08)`
- **Elevation 2**: `0 4px 8px rgba(0, 0, 0, 0.12)`
- **Elevation 3**: `0 8px 16px rgba(0, 0, 0, 0.16)`
- **Elevation 4**: `0 12px 24px rgba(0, 0, 0, 0.20)`

## 🔧 Available Scripts

### Development

```bash
npm start
```
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build

```bash
npm run build
```
Builds the app for production to the `build` folder.

### Testing

```bash
npm test
```
Launches the test runner in interactive watch mode.

```bash
npm run test:coverage
```
Runs tests with coverage report.

### Linting

```bash
npm run lint
```
Runs ESLint to check code quality.

```bash
npm run lint:fix
```
Automatically fixes linting issues.

### Format

```bash
npm run format
```
Formats code using Prettier.

## 🌓 Dark/Light Theme

The application supports both dark and light themes with smooth transitions:

1. **Theme Toggle**: Located in the header (top right)
2. **Persistence**: Theme preference is saved to localStorage
3. **System Preference**: Defaults to system theme on first visit
4. **Smooth Transitions**: 300ms fade transition between themes

### Using Theme in Components

```tsx
import { useTheme } from './hooks/useTheme';

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div className={isDark ? 'dark' : ''}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## 📱 Responsive Design

The application is mobile-first and responsive across all breakpoints:

- **Mobile**: 320px - 767px (single column, hamburger menu)
- **Tablet**: 768px - 1023px (2-column layouts)
- **Desktop**: 1024px+ (multi-column layouts)

### Touch Targets

All interactive elements are minimum 44x44px for touch accessibility.

## 🔐 Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_API_TIMEOUT=30000

# Authentication
REACT_APP_JWT_STORAGE_KEY=auth_token
REACT_APP_SESSION_TIMEOUT=1800000

# Feature Flags
REACT_APP_ENABLE_DARK_MODE=true
REACT_APP_ENABLE_ANALYTICS=false

# Application Settings
REACT_APP_APP_NAME=Patient EMR System
REACT_APP_APP_VERSION=0.1.0
REACT_APP_ENVIRONMENT=development

# Logging
REACT_APP_LOG_LEVEL=debug
```

## 🧪 Testing

### Unit Tests

Unit tests are located alongside components with `.test.tsx` suffix:

```bash
npm test
```

### Property-Based Tests

Property-based tests use `fast-check` for comprehensive input validation:

```bash
npm test -- --testPathPattern="\.pbt\.test\.tsx$"
```

## 🚀 Deployment

### Netlify (Development)

1. Connect your Git repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard
5. Deploy

### Production

For production deployment to Hostinger:

1. Build the application: `npm run build`
2. Upload the `build` folder to your hosting
3. Configure server to serve `index.html` for all routes
4. Set up SSL certificate
5. Configure environment variables

## 📚 Component Library

### Buttons

```tsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-danger">Danger Button</button>
<button className="btn-icon">Icon</button>
```

### Cards

```tsx
<div className="card">
  <h3 className="text-h4">Card Title</h3>
  <p className="text-body-regular">Card content</p>
</div>
```

### Inputs

```tsx
<input type="text" className="input" placeholder="Enter text" />
<input type="text" className="input input-error" />
<textarea className="input"></textarea>
```

### Badges

```tsx
<span className="badge badge-success">Success</span>
<span className="badge badge-error">Error</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-info">Info</span>
```

## 🔗 API Integration

The application connects to the backend API at `REACT_APP_API_URL`.

### Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all API requests
5. Token refreshed on expiration
6. User logged out on token expiration

### API Client

```tsx
import { apiClient } from './services/apiClient';

// GET request
const data = await apiClient.get('/endpoint');

// POST request
const response = await apiClient.post('/endpoint', { data });

// Error handling
try {
  const data = await apiClient.get('/endpoint');
} catch (error) {
  console.error('API Error:', error);
}
```

## 🎯 Accessibility

The application follows WCAG 2.1 AA standards:

- ✓ Keyboard navigation support
- ✓ Screen reader compatible
- ✓ Color contrast ratios (WCAG AA minimum)
- ✓ Focus indicators visible
- ✓ Semantic HTML
- ✓ ARIA labels and descriptions
- ✓ Reduced motion support

## 📖 Documentation

- [Design System](./docs/DESIGN_SYSTEM.md)
- [Component Library](./docs/COMPONENTS.md)
- [API Integration](./docs/API.md)
- [Authentication](./docs/AUTHENTICATION.md)
- [Deployment](./docs/DEPLOYMENT.md)

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Dependencies not installing

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails

```bash
npm run build -- --verbose
```

## 📝 License

This project is part of the Patient EMR System MVP. All rights reserved.

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## 📞 Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Version**: 0.1.0  
**Last Updated**: 2024  
**Status**: Development Ready
