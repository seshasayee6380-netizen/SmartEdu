# SmartEdu Database Design

## Database
PostgreSQL 15+ (proposed production database for the hackathon prototype).

## Core relationship flow

Users
→ Students / Teachers / Parents
→ Departments / Classes
→ Subjects / Timetable
→ Attendance Sessions
→ Attendance Records

Students
→ Activities / Assignments / Quiz Results
→ Risk Assessments
→ Recommendations
→ Planner Tasks
→ Notifications

Parents
→ Parent-Student relationship
→ Student progress and alerts

## Main tables

| Area | Tables |
|---|---|
| Identity | users, students, teachers, parents, parent_student |
| Academic structure | departments, classes, subjects, teacher_subjects, class_enrollments, class_subjects |
| Timetable | classrooms, timetable |
| Attendance | attendance_sessions, attendance_records |
| Curriculum activity | activities, activity_assignments |
| Assignments | assignments, assignment_submissions |
| Performance | quiz_results, risk_assessments |
| Planning | recommendations, planner_tasks |
| Student support | leave_requests, notifications |
| Gamification | student_points, badges, student_badges |
| Configuration | app_settings |

## Attendance integrity model

A teacher creates an `attendance_sessions` row with a short-lived QR token and classroom.

A student creates an `attendance_records` row when scanning.

The record stores:
- QR/session reference
- student
- scan time
- verification status
- distance from classroom
- optional coordinates
- device/session identifier
- teacher review information

This supports the SmartEdu rule:

**Valid QR + student within classroom radius → verified attendance.**

If the student is outside the radius or the QR is expired, the record can be marked for review/rejection rather than being silently accepted.

## Why this is better than the original prototype schema

The schema separates:
- authentication users from role-specific profiles
- class enrollment from the class master
- teacher-subject assignments
- class-subject assignments
- classroom location from timetable
- attendance session from individual attendance records
- activity definitions from student activity status
- assignment definitions from submissions
- raw academic signals from risk assessments and recommendations

This makes the design easier to explain to judges and easier to migrate from the current localStorage prototype to a real backend.

## ER-style overview

```text
USER ─────┬──── STUDENT ──── CLASS_ENROLLMENT ──── CLASS
         │          │                              │
         │          ├──── PARENT_STUDENT ─── PARENT│
         │          │                              │
         │          ├──── ATTENDANCE_RECORD ─ ATTENDANCE_SESSION
         │          │                              │
         │          ├──── ASSIGNMENT_SUBMISSION ─ ASSIGNMENT
         │          │                              │
         │          ├──── ACTIVITY_ASSIGNMENT ─ ACTIVITY
         │          │                              │
         │          ├──── PLANNER_TASK              │
         │          ├──── RECOMMENDATION            │
         │          ├──── RISK_ASSESSMENT           │
         │          └──── QUIZ_RESULT               │
         │                                         │
         ├──── TEACHER ───── CLASS_SUBJECT ───── SUBJECT
         │          │
         │          └──── ATTENDANCE_SESSION
         │
         └──── ADMIN

CLASS ───── TIMETABLE ───── CLASSROOM
SUBJECT ─── TIMETABLE
```
