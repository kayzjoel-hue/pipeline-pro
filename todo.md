# Pipeline Pro - Current Status

This document reflects the repo as it exists now, not the original roadmap.

## What Works Today

### Core Job Flow
- [x] Add job form with validation
- [x] Job list with search, filter, and sort
- [x] Job detail screen
- [x] Edit job flow
- [x] Delete job flow
- [x] AsyncStorage persistence for jobs
- [x] Dashboard summary cards and recent activity
- [x] Analytics metrics view

### Navigation
- [x] Bottom tab navigation
- [x] Stack routes for detail/edit flows
- [x] Back navigation
- [x] Route params for job detail and edit
- [x] Dashboard cards navigate to job detail

### Account & Auth
- [x] Local login screen
- [x] Session storage for auth state
- [x] Logout action
- [x] User profile view
- [x] User profile editing
- [x] Settings screen account section

### UX Polish
- [x] Loading states
- [x] Confirmation alerts
- [x] Haptic feedback
- [x] Basic notification/reminder settings UI

### Verification
- [x] TypeScript check passes
- [x] Unit tests pass

## What Is Still Missing

### Authentication Gaps
- [ ] Local email/password registration
- [ ] Local password reset flow
- [ ] A bundled in-app login screen independent of the external OAuth portal
- [ ] Better empty/error states when OAuth env vars are missing

### Job Management Gaps
- [ ] Archive job feature
- [ ] Pull-to-refresh on job screens
- [ ] Floating action button shortcut
- [ ] Better dashboard quick actions

### Follow-Ups
- [ ] Follow-up data model
- [ ] Follow-up list in job detail
- [ ] Add/edit/delete follow-up flow
- [ ] Reminder scheduling and notifications

### Analytics
- [ ] Charts and graphs
- [ ] Date range filtering
- [ ] CSV export
- [ ] Time-to-interview analysis visuals

### Settings
- [ ] Real dark mode implementation
- [ ] Data export/backup
- [ ] Help/about content

### Backend
- [ ] Full job CRUD via API instead of local-only storage
- [ ] Follow-up persistence
- [ ] tRPC wiring for app data sync
- [ ] Clear backend contract for profile updates beyond name/email

### QA and Release
- [ ] Device matrix testing
- [ ] Accessibility pass
- [ ] Performance profiling
- [ ] Store build packaging
- [ ] App store submission prep

## Notes

- The app now uses local sign-in and local session storage.
- The job data layer is local-first right now.
- Several items in the old roadmap were optimistic and are not implemented yet.
- The app is functional, but it is not yet “done” in a release-ready sense.

## Completed Foundations

- [x] Expo app scaffold
- [x] Tab navigation
- [x] Onboarding flow
- [x] Job CRUD screens
- [x] AsyncStorage persistence
- [x] Basic auth/session plumbing
- [x] Settings UI
- [x] Branding and theme base

## Deployment & Cleanup

- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel/Expo web from `app/`
- [ ] Set `EXPO_PUBLIC_API_BASE_URL` to the Railway backend endpoint
- [ ] Verify backend `/api/health` endpoint
- [ ] Confirm CORS and API request flow from frontend
- [ ] Consolidate desktop project folders into active vs archive categories
