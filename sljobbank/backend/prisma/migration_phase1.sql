-- ─────────────────────────────────────────────────────────────
--  Phase 1 migration: Qualifications, Job-Qualification links,
--  Student Profiles (personalization), Admin Security (2FA/lockout),
--  Admin Audit Log.
--  Run this AFTER the base schema from seed.sql / your existing DDL.
-- ─────────────────────────────────────────────────────────────
USE sl_job_bank;

CREATE TABLE IF NOT EXISTS qualifications (
  id          VARCHAR(36) PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  level       VARCHAR(20)  NOT NULL,   -- OL, AL, CERTIFICATE, DIPLOMA, HND, DEGREE, POSTGRADUATE, PROFESSIONAL
  field       VARCHAR(255),
  description VARCHAR(2000),
  is_active   BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS job_qualifications (
  id               VARCHAR(36) PRIMARY KEY,
  job_id           VARCHAR(36) NOT NULL,
  qualification_id VARCHAR(36) NOT NULL,
  institute_id     VARCHAR(36) NULL,
  required         BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (qualification_id) REFERENCES qualifications(id) ON DELETE RESTRICT,
  FOREIGN KEY (institute_id) REFERENCES institutes(id) ON DELETE SET NULL,
  INDEX idx_jq_job (job_id),
  INDEX idx_jq_qual (qualification_id)
);

CREATE TABLE IF NOT EXISTS student_profiles (
  id                  VARCHAR(36) PRIMARY KEY,
  user_id             VARCHAR(36) NOT NULL UNIQUE,
  al_stream           VARCHAR(255),
  interest_tags       VARCHAR(1000),
  top_cluster_id      VARCHAR(36) NULL,
  cluster_scores_json VARCHAR(2000),
  updated_at          DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (top_cluster_id) REFERENCES career_clusters(id) ON DELETE SET NULL
);

-- One row per SUPER_ADMIN. App logic enforces there is ever only one such user.
CREATE TABLE IF NOT EXISTS admin_security (
  id                        VARCHAR(36) PRIMARY KEY,
  user_id                   VARCHAR(36) NOT NULL UNIQUE,
  totp_secret               VARCHAR(100),
  totp_enabled              BOOLEAN DEFAULT FALSE,
  failed_attempts           INT DEFAULT 0,
  locked_until              DATETIME NULL,
  last_login_at             DATETIME NULL,
  last_login_ip             VARCHAR(64),
  recovery_token_hash       VARCHAR(255),
  recovery_token_expires_at DATETIME NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id         VARCHAR(36) PRIMARY KEY,
  user_id    VARCHAR(36) NULL,
  action     VARCHAR(50) NOT NULL,
  ip_address VARCHAR(64),
  user_agent VARCHAR(500),
  success    BOOLEAN DEFAULT FALSE,
  detail     VARCHAR(500),
  created_at DATETIME,
  INDEX idx_audit_created (created_at)
);

-- ── Sample qualifications (extend freely via the admin UI) ────
INSERT INTO qualifications (id, name, level, field, description, is_active) VALUES
  ('q-01', 'A/L Physical Science Stream',        'AL',   'Science',   'Combined Maths, Physics, Chemistry', TRUE),
  ('q-02', 'A/L Biological Science Stream',      'AL',   'Science',   'Biology, Physics, Chemistry',        TRUE),
  ('q-03', 'A/L Commerce Stream',                'AL',   'Commerce',  'Accounting, Economics, Business Studies', TRUE),
  ('q-04', 'A/L Arts Stream',                    'AL',   'Arts',      'Humanities and social science subjects', TRUE),
  ('q-05', 'A/L Technology Stream',               'AL',   'Technology','Engineering/Bio-systems Technology, Science for Technology', TRUE),
  ('q-06', 'BSc in Computer Science',             'DEGREE','IT',       'Undergraduate degree in computer science', TRUE),
  ('q-07', 'BEng in Civil Engineering',           'DEGREE','Engineering','Undergraduate engineering degree', TRUE),
  ('q-08', 'MBBS',                                'DEGREE','Health',   'Bachelor of Medicine, Bachelor of Surgery', TRUE),
  ('q-09', 'HND in Business Management',          'HND',  'Business',  'Higher National Diploma', TRUE),
  ('q-10', 'CA Sri Lanka Professional Qualification','PROFESSIONAL','Finance','Chartered Accountancy', TRUE);

-- ── IMPORTANT: admin account provisioning ──────────────────────
-- Do NOT seed a SUPER_ADMIN row directly via SQL for production use.
-- Instead, on first boot with an empty admin_security table, call:
--   POST /api/admin-auth/enroll-first-admin  { fullName, email, password }
-- then scan the returned QR code and confirm with:
--   POST /api/admin-auth/confirm-enrollment  { email, code }
-- This is the only way to create SUPER_ADMIN going forward - the endpoint
-- refuses if a SUPER_ADMIN already exists (see AdminSecurityService.assertSingleAdminSlot).
-- The 'u-admin-01' demo row in seed.sql is for local/dev testing only; delete it
-- (and its admin_security row, if any) before deploying for real students.
