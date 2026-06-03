# Deployment Guide

This document explains the recommended deployment setup for this project.

## Overview

This repo should host the backend on Railway and the frontend on Vercel or Expo web.
- **Backend:** Express + tRPC API → Railway service
- **Frontend:** Expo web app → Vercel or Expo hosting

This separation provides:
- Clear ownership of the database secret
- Simpler backend deployment for a long-running Node service
- Cleaner frontend-only hosting for the web app

## Prerequisites

- Railway account linked and project created
- Vercel account linked for frontend hosting (optional)
- GitHub repo connected if using Git-backed deployments

## Part 1: Backend Deployment (Railway)

### Setup

1. **Prepare backend config**
   - The backend is a normal Node service, not a Vercel serverless function.
   - Build command: `pnpm build`
   - Start command: `pnpm start` (or `node dist/index.js` after building, if your Railway service executes the built file directly)
   - The backend should listen on the port assigned by Railway via `process.env.PORT`.

2. **Set environment variables**
   - `DATABASE_URL` (MySQL connection string from Railway database plugin / project environment settings)
   - `NODE_ENV=production`
   - `OAUTH_SERVER_URL` (OAuth provider base URL)

3. **Deploy backend to Railway**
   - Configure one Railway service for the backend.
   - Use `pnpm build` as the build command.
   - Use `pnpm start` or `node dist/index.js` as the start command, depending on how the service is configured.

4. **Verify backend health**
   ```bash
   curl https://your-railway-backend.up.railway.app/api/health
   # Should return: { "ok": true, "timestamp": ... }
   ```

### Troubleshooting Backend Deployment

**Backend fails to start**
- Verify `OAUTH_SERVER_URL` is set.
- Confirm `DATABASE_URL` is valid and accessible.
- Check that Railway is supplying `PORT` and the app binds to it.

**tRPC endpoint returns 404**
- Backend must expose `/api/trpc`.
- Confirm `server/_core/index.ts` includes the Express tRPC middleware.

**Database connection fails**
- Ensure your MySQL host allows Railway outbound connections.
- Confirm credentials and database name are correct.

## Part 2: Frontend Deployment

### Setup

1. **Prepare frontend config**
   - Set the Vercel project Root Directory to `app/` in the Vercel UI.
   - `app/vercel.json` is front-end specific and should only be used for web hosting.
   - The backend is not deployed from a root `vercel.json` file.

2. **Set environment variable**
   ```bash
   vercel env add EXPO_PUBLIC_API_BASE_URL
   # Paste backend URL:
   # https://your-backend.railway.app/api/trpc
   ```

   > Note: Frontend env vars must start with `EXPO_PUBLIC_` to be included in the browser bundle.

3. **Deploy frontend**
   ```bash
   cd app
   vercel deploy --prod --scope=your-vercel-username
   ```
   or:
   ```bash
   vercel --cwd app deploy --prod --scope=your-vercel-username
   ```

   This deploys the `app/` folder as a static web app.
   You'll get a URL like: `https://your-app.vercel.app`

4. **Verify frontend can call backend**
   - Open browser DevTools → Network tab
   - Trigger an API call (e.g., login)
   - Check requests go to backend URL from env var

### Troubleshooting Frontend Deployment

**Blank white screen after deploy**
- Check browser console for errors
- Verify `EXPO_PUBLIC_API_BASE_URL` is set correctly
- Ensure the frontend build is producing the correct web output

**API calls return CORS errors**
- Backend CORS headers must allow the frontend origin
- Check `server/_core/index.ts` CORS middleware

**"Cannot GET /page"**
- `app/vercel.json` SPA rewrite may not be configured correctly
- Verify web build output is available at the deployed site

## Part 3: Environment Variables Checklist

### Frontend (`EXPO_PUBLIC_*`)
- `EXPO_PUBLIC_API_BASE_URL` → Backend tRPC endpoint
  - Local: `http://localhost:3000/api/trpc`
  - Production: `https://your-backend.railway.app/api/trpc`

### Backend
- `DATABASE_URL` → MySQL connection string
- `NODE_ENV` → Set to `production`
- `OAUTH_SERVER_URL` → OAuth provider base URL

### Local Development (`.env`)
```bash
# Backend
DATABASE_URL=mysql://user:password@localhost:3306/db
NODE_ENV=development

# Frontend (automatically picked up by Expo)
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api/trpc
```

## Part 4: Syncing Database Schema

When you deploy a new schema version:

1. **Before deploy:** Run migrations locally against Railway
   ```bash
   pnpm db:push
   ```
   This should use the Railway database connection string configured in `DATABASE_URL`.

2. **After backend deploys:** Verify schema matches
   ```bash
   curl https://your-backend.railway.app/api/health
   # Check backend logs for DB connection errors
   ```

3. **Automated migrations (optional)**
   - Only use this if you explicitly configure it. Railway does not run migrations automatically by default.
   - You can add an automated step or deployment hook to run migrations after deploy.
   - Example build script:
     ```json
     "build": "drizzle-kit generate && drizzle-kit migrate && esbuild..."
     ```

## Part 5: Monitoring & Debugging

### Railway Dashboard
- **Backend logs:** Railway project → service → logs
- **Deployment logs:** Review build and start logs for failures

### Local Testing
Always test locally before deploying:
```bash
pnpm dev
# Runs both server (port 3000) and Metro (port 8081)
```

### Database Debugging
```bash
# Check if tables exist and schema is current
mysql -u user -p -h host -D database
SHOW TABLES;
DESCRIBE your_table;
```

## Part 6: CI/CD Integration (Optional)

For automatic deployments on push:

1. **Connect GitHub to Railway and Vercel**
   - Railway can deploy backend from repo or Docker
   - Vercel can deploy frontend from repo

2. **Configure deployment branches**
   - Main branch auto-deploys
   - Preview deployments for PRs

3. **Secrets in GitHub or Railway**
   - Store `DATABASE_URL` in Railway project secrets
   - Store `EXPO_PUBLIC_API_BASE_URL` in Vercel project settings

## Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] `DATABASE_URL` set in Railway project
- [ ] `EXPO_PUBLIC_API_BASE_URL` set in Vercel frontend project
- [ ] `pnpm build` works locally
- [ ] Backend health endpoint responds
- [ ] Frontend can call backend API
- [ ] Database schema migrated on backend
- [ ] CORS headers allow frontend domain
- [ ] Environment variables do not leak secrets

## Rollback

If something breaks after deploy:

- Roll back the Railway service to a previous deployment
- Roll back the Vercel frontend deployment

## Notes

- Root `vercel.json` is intentionally removed from this repo to avoid accidental backend deployment via Vercel.
- Use Railway for backend and Vercel only for frontend web hosting.
