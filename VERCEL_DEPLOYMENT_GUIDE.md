# Vercel Deployment Guide

This document explains how to deploy both the frontend and backend to Vercel.

## Overview

This monorepo deploys to Vercel as **two separate projects**:
- **Frontend:** Expo web app → Vercel (main project)
- **Backend:** Express + tRPC API → Vercel (separate project)

This separation provides:
- Independent scaling and uptime
- Easier debugging and logs
- Clear API contracts via tRPC types

## Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
- Vercel account linked: `vercel login`
- GitHub repo connected (recommended)

## Part 1: Backend Deployment

### Setup

1. **Prepare backend config**
   - `vercel.json` at repo root already configured ✓
   - Build command: `pnpm build` (bundles to `dist/index.js`)
   - Requires `DATABASE_URL` environment variable

2. **Set environment variables**
   ```bash
   vercel env add DATABASE_URL
   # Paste your MySQL connection string
   # mysql://user:password@host:3306/database
   ```

3. **Deploy backend**
   ```bash
   # From repo root
   vercel deploy --prod
   ```

   This deploys `dist/index.js` as a Node.js serverless function.
   You'll get a URL like: `https://your-backend.vercel.app`

4. **Verify backend health**
   ```bash
   curl https://your-backend.vercel.app/api/health
   # Should return: { "ok": true, "timestamp": ... }
   ```

### Troubleshooting Backend Deployment

**Build fails with "dist not found"**
- Ensure `pnpm build` works locally: `pnpm build && ls dist/`
- Check `vercel.json` has `"outputDirectory": "dist"`

**Database connection times out**
- Verify `DATABASE_URL` is correct and accessible from Vercel
- MySQL firewall rules must allow Vercel IPs (usually 0.0.0.0/0 for testing)

**tRPC endpoint returns 404**
- Backend must be serving at `/api/trpc`
- Check `server/_core/index.ts` has: `app.use("/api/trpc", createExpressMiddleware(...))`

## Part 2: Frontend Deployment

### Setup

1. **Prepare frontend config**
   - `app/vercel.json` already configured ✓
   - Sets up SPA routing (rewrites to `index.html`)

2. **Set environment variable**
   ```bash
   vercel env add EXPO_PUBLIC_API_URL
   # Paste backend URL:
   # https://your-backend.vercel.app/api/trpc
   ```

   > Note: Frontend env vars must start with `EXPO_PUBLIC_` to be included in browser bundle.

3. **Deploy frontend**
   ```bash
   # From repo root
   vercel deploy --prod --scope=your-vercel-username
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
- Verify `EXPO_PUBLIC_API_URL` is set correctly
- Ensure CORS is enabled on backend (it is by default)

**API calls return CORS errors**
- Backend CORS headers must include your frontend domain
- Check `server/_core/index.ts` CORS middleware:
  ```typescript
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  ```

**"Cannot GET /page"** 
- `app/vercel.json` SPA rewrite not applied
- Check file exists at repo root under `app/` folder
- Vercel needs rewrite rule to serve `index.html`

## Part 3: Environment Variables Checklist

### Frontend (`EXPO_PUBLIC_*`)
- `EXPO_PUBLIC_API_URL` → Backend tRPC endpoint
  - Local: `http://localhost:3000/api/trpc`
  - Production: `https://your-backend.vercel.app/api/trpc`

### Backend
- `DATABASE_URL` → MySQL connection string
- `NODE_ENV` → Set to `production` on Vercel
- OAuth secrets (if configured)

### Local Development (`.env`)
```bash
# Backend
DATABASE_URL=mysql://user:password@localhost:3306/db
NODE_ENV=development

# Frontend (automatically picked up by Expo)
EXPO_PUBLIC_API_URL=http://localhost:3000/api/trpc
```

## Part 4: Syncing Database Schema

When you deploy a new schema version:

1. **Before deploy:** Run migrations locally
   ```bash
   pnpm db:push
   ```

2. **After backend deploys:** Verify schema matches
   ```bash
   curl https://your-backend.vercel.app/api/health
   # Check backend logs in Vercel dashboard for DB connection errors
   ```

3. **Automated migrations (optional)**
   - Add to backend `package.json` build script:
     ```json
     "build": "drizzle-kit generate && drizzle-kit migrate && esbuild..."
     ```
   - Or create a Vercel webhook to run migrations post-deploy

## Part 5: Monitoring & Debugging

### Vercel Dashboard
- **Backend logs:** Vercel Dashboard → Project → Deployments → Logs
- **Frontend logs:** Check browser console or Vercel Edge Network logs

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

1. **Connect GitHub to Vercel**
   - Vercel dashboard → Settings → Git Integration
   - Select your repo

2. **Configure deployment branches**
   - Main branch auto-deploys
   - Preview deployments for PRs

3. **Secrets in GitHub**
   - Store `DATABASE_URL` in GitHub secrets
   - Vercel pulls from GitHub to preview deploys

## Deployment Checklist

- [ ] Backend `vercel.json` at root ✓
- [ ] Frontend `app/vercel.json` present ✓
- [ ] `DATABASE_URL` set in backend Vercel project
- [ ] `EXPO_PUBLIC_API_URL` set in frontend Vercel project
- [ ] `pnpm build` works locally
- [ ] Backend health endpoint responds
- [ ] Frontend can call backend API
- [ ] Database schema migrated on backend
- [ ] CORS headers allow frontend domain
- [ ] Environment variables don't leak secrets

## Rollback

If something breaks after deploy:

**Backend:**
```bash
vercel rollback
```

**Frontend:**
```bash
vercel rollback
```

Or manually revert to previous deployment in Vercel dashboard.

## Cost Optimization

- **Vercel free tier:** 100GB bandwidth, limited serverless executions
- **Scale:** Upgrade to Pro ($20/month) for production apps
- **Database:** Keep MySQL on separate provider (AWS RDS, DigitalOcean, etc.)

---

For detailed Vercel docs, see: https://vercel.com/docs
