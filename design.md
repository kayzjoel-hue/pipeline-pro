# Pipeline Pro - Mobile App Interface Design

## 1. Design Principles

Pipeline Pro is designed for **mobile portrait orientation (9:16)** with **one-handed usage** as the primary interaction model. The app follows **Apple Human Interface Guidelines (HIG)** to feel like a first-party iOS app, ensuring mainstream iOS design standards and accessibility.

**Core Design Values:**
- **Clarity:** Users should understand their job pipeline status at a glance
- **Speed:** Quick actions (add job, schedule follow-up, update status) in under 3 taps
- **Feedback:** Every action provides visual confirmation
- **Focus:** Minimize cognitive load; show only what matters now

---

## 2. Screen List

The Pipeline Pro app consists of the following screens:

| Screen Name | Purpose | Key Elements |
|-------------|---------|--------------|
| **Authentication** | User login/registration | Email, password fields; OAuth option |
| **Dashboard** | Overview of job pipeline | Pipeline stages, follow-up count, quick stats |
| **Job List** | All job applications | Filterable list, search, status badges |
| **Job Detail** | Single job application | Full details, follow-ups, notes, action buttons |
| **Add/Edit Job** | Create or modify job | Form fields, date picker, status selector |
| **Follow-Up List** | Follow-ups for a job | Scheduled follow-ups, completion status |
| **Add Follow-Up** | Schedule a follow-up | Description, date/time picker, reminder toggle |
| **Analytics** | Pipeline insights | Charts, conversion rates, application trends |
| **Settings** | User preferences | Profile, notifications, data export |

---

## 3. Primary Content and Functionality

### 3.1 Dashboard Screen
**Content:** High-level overview of the user's job pipeline.

- **Pipeline Summary:** Visual representation of applications at each stage (Applied, Interview, Offer, Rejected)
- **Follow-Up Count:** Number of pending follow-ups due today/this week
- **Quick Stats:** Total applications, success rate, average time-to-offer
- **Quick Actions:** "Add Job" button, "Schedule Follow-Up" button (floating action button)
- **Recent Activity:** Last 3 jobs added or updated

**Functionality:**
- Tap on a stage to filter the job list
- Tap "Add Job" to navigate to the add job screen
- Pull-to-refresh to sync data
- Swipe to navigate to other tabs (Job List, Analytics, Settings)

### 3.2 Job List Screen
**Content:** Scrollable list of all job applications.

- **Job Cards:** Each card displays company name, job title, status badge, application date, and next follow-up date
- **Filter/Sort Options:** Filter by status, sort by date or follow-up date
- **Search Bar:** Search by company name or job title
- **Status Badges:** Color-coded (e.g., blue for Applied, orange for Interview, green for Offer, gray for Rejected)

**Functionality:**
- Tap a job card to view details
- Swipe left to delete (with confirmation)
- Long-press to see quick actions (edit, delete, archive)
- Pull-to-refresh

### 3.3 Job Detail Screen
**Content:** Complete information about a single job application.

- **Header:** Company name, job title, status badge
- **Key Details:** Application date, last updated, location, salary (if available)
- **Notes Section:** User-entered notes about the job or company
- **Follow-Ups Section:** List of scheduled follow-ups with completion status
- **Action Buttons:** "Edit Job", "Add Follow-Up", "Mark as Completed", "Delete"

**Functionality:**
- Tap "Edit Job" to modify details
- Tap "Add Follow-Up" to schedule a follow-up
- Tap a follow-up to mark it complete or edit it
- Tap "Mark as Completed" to move job to a completed state
- Swipe to go back to job list

### 3.4 Add/Edit Job Screen
**Content:** Form to create or modify a job application.

- **Form Fields:**
  - Company Name (text input, required)
  - Job Title (text input, required)
  - Application Date (date picker, required)
  - Status (dropdown: Applied, Interview, Offer, Rejected)
  - Location (text input, optional)
  - Salary (text input, optional)
  - Notes (multiline text, optional)
  - Job URL (text input, optional)

- **Action Buttons:** "Save", "Cancel"

**Functionality:**
- Pre-fill fields if editing an existing job
- Validate required fields before saving
- Show success message after saving
- Return to job detail or job list after saving

### 3.5 Follow-Up Management
**Content:** Schedule and track follow-ups for each job.

- **Follow-Up List (in Job Detail):** Shows all follow-ups for the job with dates, descriptions, and completion status
- **Add Follow-Up Screen:** Form to schedule a new follow-up
  - Description (text input, required)
  - Follow-Up Date (date/time picker, required)
  - Reminder (toggle: 1 day before, 1 hour before, at time)
  - Notes (multiline text, optional)

**Functionality:**
- Tap "Add Follow-Up" to create a new follow-up
- Tap a follow-up to mark it complete
- Swipe to delete a follow-up
- Receive notifications for pending follow-ups

### 3.6 Analytics Screen
**Content:** Insights and trends in the user's job search.

- **Charts:**
  - Applications by Status (pie chart)
  - Applications Over Time (line chart)
  - Time-to-Interview (histogram)
  - Success Rate (percentage)

- **Key Metrics:**
  - Total applications
  - Interviews scheduled
  - Offers received
  - Rejection rate
  - Average days to first interview

**Functionality:**
- Tap on chart to see more details
- Filter by date range
- Export data as CSV

---

## 4. Key User Flows

### Flow 1: Add a New Job Application
1. User taps "Add Job" button on Dashboard
2. Add Job screen opens with empty form
3. User fills in company name, job title, application date, and status
4. User taps "Save"
5. App saves job and returns to Dashboard
6. Dashboard updates with new job in the Applied stage

### Flow 2: Schedule a Follow-Up
1. User navigates to Job Detail screen
2. User taps "Add Follow-Up"
3. Add Follow-Up screen opens
4. User enters follow-up description and date
5. User toggles reminder (e.g., 1 day before)
6. User taps "Save"
7. App saves follow-up and returns to Job Detail
8. Follow-up appears in the Follow-Ups section
9. User receives notification at the scheduled time

### Flow 3: Update Job Status
1. User navigates to Job List
2. User taps on a job card (e.g., "Applied" status)
3. Job Detail screen opens
4. User taps "Edit Job"
5. Add/Edit Job screen opens with pre-filled data
6. User changes status to "Interview"
7. User taps "Save"
8. App updates job and returns to Job Detail
9. Status badge changes to "Interview"

### Flow 4: Review Pipeline Analytics
1. User taps "Analytics" tab
2. Analytics screen displays charts and metrics
3. User can see total applications, interviews, offers, and rejection rate
4. User can filter by date range to see trends
5. User can tap on a chart to see more details

---

## 5. Color Choices

Pipeline Pro uses a professional, job-search-focused color palette that conveys trust, progress, and clarity:

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary (Teal)** | `#0a7ea4` | Buttons, links, active states, accents |
| **Background** | `#ffffff` (light), `#151718` (dark) | Screen background |
| **Surface** | `#f5f5f5` (light), `#1e2022` (dark) | Cards, elevated surfaces |
| **Foreground** | `#11181C` (light), `#ECEDEE` (dark) | Primary text |
| **Muted** | `#687076` (light), `#9BA1A6` (dark) | Secondary text, hints |
| **Border** | `#E5E7EB` (light), `#334155` (dark) | Dividers, borders |
| **Success (Green)** | `#22C55E` | Offer received, follow-up completed |
| **Warning (Amber)** | `#F59E0B` | Interview scheduled, follow-up pending |
| **Error (Red)** | `#EF4444` | Rejection, delete actions |

**Status Badge Colors:**
- **Applied:** Teal (primary)
- **Interview:** Amber (warning)
- **Offer:** Green (success)
- **Rejected:** Red (error)

---

## 6. Interaction Patterns

### Navigation
- **Tab Bar:** Bottom tab navigation for Dashboard, Job List, Analytics, Settings
- **Stack Navigation:** Back button for returning to previous screen
- **Floating Action Button (FAB):** Quick access to "Add Job" and "Schedule Follow-Up" from Dashboard

### Feedback
- **Loading States:** Spinner while fetching data
- **Success Messages:** Toast notification after saving
- **Error Messages:** Alert dialog with error details and retry option
- **Haptic Feedback:** Subtle vibration on button press (iOS)

### Accessibility
- **Large Touch Targets:** Minimum 44x44 pt for buttons
- **High Contrast:** Text meets WCAG AA standards
- **Font Sizes:** Base 16pt for body text, 20pt for headers
- **Dark Mode:** Full support for dark mode with automatic switching

---

## 7. Layout Specifics

### Dashboard Layout
- Header with greeting and date
- Pipeline summary (4 columns: Applied, Interview, Offer, Rejected)
- Follow-up count card
- Recent activity section
- Floating action button in bottom-right

### Job List Layout
- Search bar at top
- Filter/sort options
- Job cards in a vertical list
- Each card shows: company, title, status, dates

### Job Detail Layout
- Header with back button and job title
- Key details section
- Notes section
- Follow-ups section
- Action buttons at bottom

---

## 8. Responsive Design

Pipeline Pro is optimized for mobile portrait orientation. The app will scale appropriately for:
- **iPhone SE (small):** 375pt width
- **iPhone 12/13 (standard):** 390pt width
- **iPhone 12/13 Pro Max (large):** 428pt width
- **iPad (tablet):** Landscape and portrait (future enhancement)

All text, buttons, and spacing scale proportionally to maintain readability and usability across device sizes.

---

## 9. Next Steps

1. Implement authentication screens (login/registration)
2. Build Dashboard with pipeline summary and quick actions
3. Create Job List with filtering and search
4. Develop Job Detail screen with full job information
5. Implement Add/Edit Job form with validation
6. Build Follow-Up scheduling and tracking
7. Create Analytics screen with charts and metrics
8. Add Settings screen for user preferences
9. Implement push notifications for follow-up reminders
10. Polish UI and conduct user testing
