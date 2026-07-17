-- ─────────────────────────────────────────────────────────────
--  Phase 3 migration: usage analytics (monthly active users,
--  yearly statistical report, most/least searched jobs)
--  Run AFTER migration_phase1.sql and migration_phase2.sql
-- ─────────────────────────────────────────────────────────────
USE sl_job_bank;

CREATE TABLE IF NOT EXISTS login_logs (
  id       VARCHAR(36) PRIMARY KEY,
  user_id  VARCHAR(36) NOT NULL,
  role     VARCHAR(20) NOT NULL,
  login_at DATETIME NOT NULL,
  INDEX idx_login_user (user_id),
  INDEX idx_login_at (login_at),
  INDEX idx_login_role_at (role, login_at)
);

-- Note: "most/least searched jobs" is computed from the existing student_views
-- table (job detail views) - JobService.trackView had a bug where it saved an
-- unsaved/empty User instead of the actual viewer; that's fixed in this phase
-- so future views record correctly. No new table needed for that part.
