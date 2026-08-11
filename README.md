# SmartEdu — Intelligent Attendance & Academic Success Platform

SmartEdu is a prototype that combines verified QR attendance, classroom proximity verification, timetable/free-period intelligence, personalized academic recommendations, daily planning, academic risk detection, parent alerts, and analytics.

## Core flow

Teacher starts attendance → dynamic QR → student scans → classroom proximity verification → verified attendance → analytics/risk detection → free-period detection → personalized recommendation → daily planner → parent action alert.

## Roles

- Student
- Teacher
- Parent
- Admin

## Key features

- Dynamic QR attendance with short expiry
- Classroom proximity verification
- Attendance integrity review
- Subject-wise attendance and attendance recovery projection
- Daily timetable and free-period detection
- Personalized academic recommendations
- Explainable recommendations
- Daily planner and focus sessions
- Academic risk detection and intervention
- Parent dashboard and action alerts
- Activities, assignments, leave management
- Gamification and leaderboard
- Attendance, class, department and institution analytics
- Reports and CSV export

## Tech stack

- React 18
- Vite
- JavaScript / JSX
- CSS
- Browser localStorage for prototype data
- QRCode.js for QR generation

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build for production

```bash
npm run build
npm run preview
```

## Demo accounts

- Student: `student@smartedu.com` / `student123`
- Teacher: `teacher@smartedu.com` / `teacher123`
- Parent: `parent@smartedu.com` / `parent123`
- Admin: `admin@smartedu.com` / `admin123`

## Database

`database/schema.sql` contains the production-oriented relational schema for users, classes, students, timetable, attendance sessions/records, assignments, activities, planner tasks, leave requests and notifications.

## Deployment

This project is Vite-compatible with Vercel, Netlify, Render, or another static/SPA hosting platform. Configure the build command as `npm run build` and publish the `dist` directory.

## Important prototype note

The current hackathon prototype stores demo data in browser localStorage. For production, authentication, QR validation, attendance records, proximity verification, and database writes should be moved to a secure backend.
