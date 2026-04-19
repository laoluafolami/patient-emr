# MediCore EMR — Deployment Guide

## Overview

This guide covers deploying the Patient EMR System for both **development** (free tier) and **production** (Hostinger Business).

---

## Architecture

```
Frontend (React)  →  Backend (Node.js/Express)  →  Database (PostgreSQL)
```

---

## Development Deployment (Free Tier)

### Stack
| Service | Provider | Cost |
|---|---|---|
| Frontend | Netlify | Free |
| Backend | Render | Free |
| Database | Render PostgreSQL | Free (90 days) or Supabase (free forever) |

---

### Step 1 — Database (Supabase — recommended free option)

1. Go to **https://supabase.com** → Create account → New Project
2. Note your connection string: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
3. Update `patient-emr-backend/.env`:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```
4. Run migrations:
   ```bash
   cd patient-emr-backend
   npx prisma migrate deploy
   npx ts-node prisma/seed.ts
   ```

---

### Step 2 — Backend (Render)

1. Go to **https://render.com** → Sign up → New Web Service
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `patient-emr-backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Add environment variables (from your `.env` file):
   ```
   DATABASE_URL=<your supabase connection string>
   JWT_SECRET=<strong random string>
   JWT_EXPIRATION=8h
   CORS_ORIGIN=https://your-netlify-app.netlify.app
   FRONTEND_URL=https://your-netlify-app.netlify.app
   NODE_ENV=production
   ```
5. Deploy → note your backend URL (e.g. `https://patient-emr-api.onrender.com`)

---

### Step 3 — Frontend (Netlify)

1. Go to **https://netlify.com** → Sign up → Add new site → Import from Git
2. Configure:
   - **Base directory**: `patient-emr-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `patient-emr-frontend/build`
3. Add environment variables:
   ```
   REACT_APP_API_URL=https://patient-emr-api.onrender.com/api
   REACT_APP_JWT_STORAGE_KEY=emr_auth_token
   ```
4. Add a `_redirects` file for React Router:
   ```
   /*  /index.html  200
   ```
5. Deploy

---

## Production Deployment (Hostinger Business)

### Prerequisites
- Hostinger Business hosting plan
- Node.js support enabled (contact Hostinger support if needed)
- SSH access to your hosting account

---

### Step 1 — Database Setup on Hostinger

1. Log in to **hPanel** → Databases → MySQL/PostgreSQL
2. Create a new PostgreSQL database:
   - Database name: `patient_emr_db`
   - Note the host, username, and password
3. Update your production `.env`:
   ```
   DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]:5432/patient_emr_db
   ```

---

### Step 2 — Backend Deployment

1. SSH into your Hostinger server:
   ```bash
   ssh username@your-domain.com
   ```
2. Clone your repository:
   ```bash
   git clone https://github.com/your-username/patient-emr.git
   cd patient-emr/patient-emr-backend
   ```
3. Install dependencies and build:
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npx ts-node prisma/seed.ts
   npm run build
   ```
4. Create production `.env` with all variables
5. Start with PM2 (process manager):
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name "emr-backend"
   pm2 save
   pm2 startup
   ```
6. Configure Nginx reverse proxy to forward port 3001

---

### Step 3 — Frontend Deployment

1. Build locally:
   ```bash
   cd patient-emr-frontend
   REACT_APP_API_URL=https://your-domain.com/api npm run build
   ```
2. Upload the `build/` folder to your Hostinger `public_html` directory via:
   - File Manager in hPanel, or
   - FTP/SFTP client (FileZilla)
3. Add `.htaccess` for React Router:
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QSA,L]
   ```

---

## Environment Variables Reference

### Backend (`.env`)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-super-secret-key-minimum-32-chars
JWT_EXPIRATION=8h
CORS_ORIGIN=https://your-frontend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM="MediCore EMR <noreply@your-domain.com>"
```

### Frontend (`.env.production`)
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_JWT_STORAGE_KEY=emr_auth_token
```

---

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Seed data created (admin user)
- [ ] Backend health check responds: `GET /health`
- [ ] Frontend loads at your domain
- [ ] Login works with `admin@emr.health`
- [ ] HTTPS/SSL certificate active
- [ ] CORS configured correctly
- [ ] Email sending works (test password reset)
- [ ] All 4 role dashboards accessible

---

## Default Login Credentials

> **Change these immediately after first login!**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@emr.health` | `Admin@EMR2024!` |
| Doctor | `dr.smith@emr.health` | `Doctor@EMR2024!` |
| Nurse | `nurse.johnson@emr.health` | `Nurse@EMR2024!` |
| Patient | `patient.doe@example.com` | `Patient@EMR2024!` |

---

## Troubleshooting

**Backend won't start**: Check `DATABASE_URL` is correct and database is accessible.

**Login fails**: Ensure seed ran successfully. Check backend logs for errors.

**CORS errors**: Verify `CORS_ORIGIN` in backend `.env` matches your frontend URL exactly.

**Frontend shows blank page**: Check `REACT_APP_API_URL` points to your running backend.

**Emails not sending**: Configure SMTP settings. For Gmail, use an App Password (not your regular password).
