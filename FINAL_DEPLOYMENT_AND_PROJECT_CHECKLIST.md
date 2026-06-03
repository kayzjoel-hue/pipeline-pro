# Final Deployment and Project Cleanup Checklist

## Purpose
This file captures the final deployment checklist for `pipeline_pro` and the high-level desktop project cleanup plan. It is meant to be the last step before publishing and the first planning artifact for cross-project consolidation.

---

## Pipeline Pro: Final Deployment Checklist

### Backend (Railway)
- [ ] Build the backend with `pnpm build`
- [ ] Deploy the backend service to Railway
- [ ] Set Railway env vars:
  - `DATABASE_URL`
  - `NODE_ENV=production`
  - `OAUTH_SERVER_URL`
- [ ] Confirm the backend starts on `process.env.PORT`
- [ ] Verify `/api/health` responds successfully
- [ ] Confirm CORS works for the frontend origin

### Frontend (Vercel / Expo web)
- [ ] Deploy the frontend from `app/`
- [ ] Set `EXPO_PUBLIC_API_BASE_URL` in Vercel:
  - `https://<railway-backend>.railway.app/api/trpc`
- [ ] Confirm `app/vercel.json` is used only for frontend hosting
- [ ] Verify frontend API calls reach the Railway backend
- [ ] Confirm any client-side env vars are `EXPO_PUBLIC_*`

### Local Validation
- [ ] Run `pnpm dev` and verify the full local app starts cleanly
- [ ] Run `pnpm build` and `pnpm start` for backend locally
- [ ] Confirm the frontend can communicate with the backend in local mode
- [ ] Confirm `pnpm db:push` runs successfully for migrations

---

## Current Repo Priorities
- `pipeline_pro` is the highest-priority active project
- `booking-system` is a production-ready Next.js app and secondary priority
- `RCA/rca-upgrade/` is the canonical production source for the RCA project
- `cv website`, `kaizrug cast`, `kaizrug-lab`, and `MTAi-Production.worktrees` are archive/design/demo material

---

## Desktop Project Cleanup Plan

### Keep active
- `pipeline_pro`
- `booking-system`
- `RCA/rca-upgrade/`

### Archive or consolidate
- `cv website`
  - Keep the best version only
  - Move older drafts into a single archive folder
- `kaizrug cast`
  - Preserve as static site snapshot
- `kaizrug-lab`
  - Preserve as experimental lab content
- `MTAi-Production.worktrees/agents-introduce-chatbot-functionality`
  - Treat as documentation/feature branch workspace

---

## What Remains
- [ ] Final deploy of backend and frontend
- [ ] End-to-end validation of API and auth flows
- [ ] Consolidate desktop folders into active vs archive buckets
- [ ] Remove stale root deployment config if any remains

---

## Notes
- The current “drift” is mainly scope: the repo moved from backend setup into deployment readiness.
- This file is the executed plan to close that drift and prepare the app for release.
