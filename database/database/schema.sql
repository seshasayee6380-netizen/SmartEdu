-- SmartEdu Database Schema
-- PostgreSQL 15+
-- Purpose: production-oriented relational design for the SmartEdu hackathon prototype.
-- The current prototype may use localStorage, but this schema defines the intended backend data model.

BEGIN;

CREATE TABLE users (
    user_id              BIGSERIAL PRIMARY KEY,
    full_name            VARCHAR(120) NOT NULL,
    email                VARCHAR(180) NOT NULL UNIQUE,
    password_hash        TEXT NOT NULL,
    role                 VARCHAR(20) NOT NULL
        CHECK (role IN ('student','teacher','parent','admin')),
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE departments (
    department_id        BIGSERIAL PRIMARY KEY,
    code                 VARCHAR(20) NOT NULL UNIQUE,
    name                 VARCHAR(120) NOT NULL UNIQUE,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE classes (
    class_id             BIGSERIAL PRIMARY KEY,
    department_id        BIGINT NOT NULL REFERENCES departments(department_id),
    class_name           VARCHAR(80) NOT NULL,
    academic_year        VARCHAR(20) NOT NULL,
    section              VARCHAR(20),
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (department_id, class_name, academic_year, section)
);

CREATE TABLE students (
    student_id           BIGSERIAL PRIMARY KEY,
    user_id              BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    roll_no               VARCHAR(40) NOT NULL UNIQUE,
    class_id             BIGINT NOT NULL REFERENCES classes(class_id),
    department_id        BIGINT NOT NULL REFERENCES departments(department_id),
    admission_year       SMALLINT,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE teachers (
    teacher_id           BIGSERIAL PRIMARY KEY,
    user_id              BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    employee_code        VARCHAR(40) UNIQUE,
    department_id        BIGINT REFERENCES departments(department_id),
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE parents (
    parent_id            BIGSERIAL PRIMARY KEY,
    user_id              BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    phone                 VARCHAR(30),
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE parent_student (
    parent_id            BIGINT NOT NULL REFERENCES parents(parent_id) ON DELETE CASCADE,
    student_id           BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    relationship         VARCHAR(40),
    is_primary            BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (parent_id, student_id)
);

CREATE TABLE subjects (
    subject_id           BIGSERIAL PRIMARY KEY,
    subject_code         VARCHAR(30) NOT NULL UNIQUE,
    subject_name         VARCHAR(120) NOT NULL,
    department_id        BIGINT REFERENCES departments(department_id),
    credits              NUMERIC(4,1),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Which teachers can teach which subjects.
CREATE TABLE teacher_subjects (
    teacher_id           BIGINT NOT NULL REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    subject_id           BIGINT NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
    PRIMARY KEY (teacher_id, subject_id)
);

-- Class enrollment keeps students independent from a single class record over time.
CREATE TABLE class_enrollments (
    enrollment_id        BIGSERIAL PRIMARY KEY,
    student_id           BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    class_id             BIGINT NOT NULL REFERENCES classes(class_id) ON DELETE CASCADE,
    academic_year        VARCHAR(20) NOT NULL,
    start_date           DATE,
    end_date             DATE,
    status               VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','completed','transferred')),
    UNIQUE (student_id, class_id, academic_year)
);

CREATE TABLE class_subjects (
    class_subject_id     BIGSERIAL PRIMARY KEY,
    class_id             BIGINT NOT NULL REFERENCES classes(class_id) ON DELETE CASCADE,
    subject_id           BIGINT NOT NULL REFERENCES subjects(subject_id),
    teacher_id            BIGINT REFERENCES teachers(teacher_id),
    academic_year        VARCHAR(20) NOT NULL,
    UNIQUE (class_id, subject_id, academic_year)
);

CREATE TABLE classrooms (
    classroom_id         BIGSERIAL PRIMARY KEY,
    room_code            VARCHAR(40) NOT NULL UNIQUE,
    room_name            VARCHAR(100),
    latitude             NUMERIC(10,7),
    longitude            NUMERIC(10,7),
    allowed_radius_m     INTEGER NOT NULL DEFAULT 75 CHECK (allowed_radius_m > 0)
);

CREATE TABLE timetable (
    timetable_id         BIGSERIAL PRIMARY KEY,
    class_id             BIGINT NOT NULL REFERENCES classes(class_id) ON DELETE CASCADE,
    subject_id           BIGINT REFERENCES subjects(subject_id),
    teacher_id            BIGINT REFERENCES teachers(teacher_id),
    classroom_id         BIGINT REFERENCES classrooms(classroom_id),
    day_of_week          SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    start_time           TIME NOT NULL,
    end_time             TIME NOT NULL,
    period_label         VARCHAR(50),
    is_free_period       BOOLEAN NOT NULL DEFAULT FALSE,
    CHECK (end_time > start_time)
);

-- Teacher creates a short-lived attendance session for one class/subject.
CREATE TABLE attendance_sessions (
    attendance_session_id BIGSERIAL PRIMARY KEY,
    class_id              BIGINT NOT NULL REFERENCES classes(class_id),
    subject_id            BIGINT NOT NULL REFERENCES subjects(subject_id),
    teacher_id             BIGINT NOT NULL REFERENCES teachers(teacher_id),
    classroom_id           BIGINT REFERENCES classrooms(classroom_id),
    qr_token_hash          TEXT NOT NULL UNIQUE,
    started_at             TIMESTAMPTZ NOT NULL,
    expires_at             TIMESTAMPTZ NOT NULL,
    status                 VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','ended','expired')),
    created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (expires_at > started_at)
);

CREATE TABLE attendance_records (
    attendance_record_id  BIGSERIAL PRIMARY KEY,
    attendance_session_id BIGINT NOT NULL REFERENCES attendance_sessions(attendance_session_id) ON DELETE CASCADE,
    student_id             BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    scanned_at              TIMESTAMPTZ NOT NULL,
    status                  VARCHAR(20) NOT NULL
        CHECK (status IN ('present','absent','review','rejected')),
    verification_status    VARCHAR(30) NOT NULL
        CHECK (verification_status IN ('verified','outside_radius','expired_qr','duplicate','pending_review','rejected')),
    distance_m              INTEGER CHECK (distance_m IS NULL OR distance_m >= 0),
    device_session_id      VARCHAR(120),
    latitude                NUMERIC(10,7),
    longitude               NUMERIC(10,7),
    verification_reason    TEXT,
    reviewed_by_teacher_id BIGINT REFERENCES teachers(teacher_id),
    reviewed_at             TIMESTAMPTZ,
    UNIQUE (attendance_session_id, student_id)
);

CREATE TABLE activities (
    activity_id             BIGSERIAL PRIMARY KEY,
    subject_id              BIGINT REFERENCES subjects(subject_id),
    created_by_teacher_id   BIGINT REFERENCES teachers(teacher_id),
    title                   VARCHAR(180) NOT NULL,
    activity_type           VARCHAR(60) NOT NULL,
    description             TEXT,
    due_date                DATE,
    estimated_minutes       INTEGER CHECK (estimated_minutes IS NULL OR estimated_minutes > 0),
    points                  INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
    priority                VARCHAR(20) DEFAULT 'normal'
        CHECK (priority IN ('low','normal','high')),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE activity_assignments (
    activity_assignment_id  BIGSERIAL PRIMARY KEY,
    activity_id             BIGINT NOT NULL REFERENCES activities(activity_id) ON DELETE CASCADE,
    student_id              BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    status                  VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','in_progress','completed','overdue')),
    completed_at             TIMESTAMPTZ,
    UNIQUE (activity_id, student_id)
);

CREATE TABLE assignments (
    assignment_id           BIGSERIAL PRIMARY KEY,
    subject_id               BIGINT REFERENCES subjects(subject_id),
    created_by_teacher_id    BIGINT REFERENCES teachers(teacher_id),
    title                    VARCHAR(180) NOT NULL,
    instructions             TEXT,
    assigned_date            DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date                 DATE,
    max_marks                INTEGER CHECK (max_marks IS NULL OR max_marks > 0),
    created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE assignment_submissions (
    assignment_submission_id BIGSERIAL PRIMARY KEY,
    assignment_id            BIGINT NOT NULL REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    student_id               BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    status                   VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','submitted','late','graded')),
    submitted_at             TIMESTAMPTZ,
    marks                    NUMERIC(6,2),
    feedback                 TEXT,
    UNIQUE (assignment_id, student_id)
);

CREATE TABLE quiz_results (
    quiz_result_id           BIGSERIAL PRIMARY KEY,
    student_id               BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    subject_id               BIGINT REFERENCES subjects(subject_id),
    quiz_title               VARCHAR(180) NOT NULL,
    score                    NUMERIC(6,2) NOT NULL,
    max_score                NUMERIC(6,2) NOT NULL,
    attempted_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (score >= 0 AND max_score > 0 AND score <= max_score)
);

CREATE TABLE planner_tasks (
    planner_task_id          BIGSERIAL PRIMARY KEY,
    student_id               BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    activity_id              BIGINT REFERENCES activities(activity_id),
    subject_id               BIGINT REFERENCES subjects(subject_id),
    title                    VARCHAR(180) NOT NULL,
    scheduled_date           DATE NOT NULL,
    start_time               TIME,
    duration_minutes         INTEGER CHECK (duration_minutes IS NULL OR duration_minutes > 0),
    priority                 VARCHAR(20) DEFAULT 'normal'
        CHECK (priority IN ('low','normal','high')),
    reason                   TEXT,
    source                   VARCHAR(30) DEFAULT 'student'
        CHECK (source IN ('student','recommendation','teacher')),
    status                   VARCHAR(20) DEFAULT 'planned'
        CHECK (status IN ('planned','in_progress','completed','skipped')),
    created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE risk_assessments (
    risk_assessment_id       BIGSERIAL PRIMARY KEY,
    student_id               BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    attendance_score         NUMERIC(5,2),
    activity_score           NUMERIC(5,2),
    assignment_score         NUMERIC(5,2),
    quiz_score               NUMERIC(5,2),
    overall_score            NUMERIC(5,2),
    risk_level               VARCHAR(20) NOT NULL
        CHECK (risk_level IN ('low','medium','high')),
    reasons                  JSONB,
    assessed_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recommendations (
    recommendation_id       BIGSERIAL PRIMARY KEY,
    student_id              BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    subject_id              BIGINT REFERENCES subjects(subject_id),
    activity_id              BIGINT REFERENCES activities(activity_id),
    title                   VARCHAR(180) NOT NULL,
    reason                   TEXT NOT NULL,
    recommended_minutes     INTEGER,
    priority                VARCHAR(20) DEFAULT 'normal'
        CHECK (priority IN ('low','normal','high')),
    recommendation_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    accepted                 BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE leave_requests (
    leave_request_id        BIGSERIAL PRIMARY KEY,
    student_id              BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    from_date               DATE NOT NULL,
    to_date                 DATE NOT NULL,
    reason                  TEXT NOT NULL,
    supporting_document_url TEXT,
    status                  VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','approved','rejected')),
    reviewed_by_teacher_id  BIGINT REFERENCES teachers(teacher_id),
    reviewed_at             TIMESTAMPTZ,
    CHECK (to_date >= from_date)
);

CREATE TABLE notifications (
    notification_id         BIGSERIAL PRIMARY KEY,
    recipient_user_id       BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title                   VARCHAR(180) NOT NULL,
    message                 TEXT NOT NULL,
    notification_type       VARCHAR(40) NOT NULL,
    related_student_id      BIGINT REFERENCES students(student_id),
    is_read                 BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE student_points (
    student_id              BIGINT PRIMARY KEY REFERENCES students(student_id) ON DELETE CASCADE,
    total_points             INTEGER NOT NULL DEFAULT 0 CHECK (total_points >= 0)
);

CREATE TABLE badges (
    badge_id                 BIGSERIAL PRIMARY KEY,
    badge_name               VARCHAR(100) NOT NULL UNIQUE,
    description              TEXT,
    points_required          INTEGER CHECK (points_required IS NULL OR points_required >= 0)
);

CREATE TABLE student_badges (
    student_id               BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    badge_id                  BIGINT NOT NULL REFERENCES badges(badge_id) ON DELETE CASCADE,
    awarded_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (student_id, badge_id)
);

CREATE TABLE app_settings (
    setting_key              VARCHAR(80) PRIMARY KEY,
    setting_value            TEXT NOT NULL,
    updated_by_user_id       BIGINT REFERENCES users(user_id),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_department ON students(department_id);
CREATE INDEX idx_class_enrollments_student ON class_enrollments(student_id);
CREATE INDEX idx_timetable_class_day ON timetable(class_id, day_of_week);
CREATE INDEX idx_attendance_sessions_class_date ON attendance_sessions(class_id, started_at);
CREATE INDEX idx_attendance_records_student_date ON attendance_records(student_id, scanned_at);
CREATE INDEX idx_attendance_records_status ON attendance_records(status, verification_status);
CREATE INDEX idx_activities_student_status ON activity_assignments(student_id, status);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_submissions_student ON assignment_submissions(student_id, status);
CREATE INDEX idx_planner_student_date ON planner_tasks(student_id, scheduled_date);
CREATE INDEX idx_risk_student_date ON risk_assessments(student_id, assessed_at);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_user_id, is_read);
CREATE INDEX idx_leave_student_status ON leave_requests(student_id, status);

COMMIT;
