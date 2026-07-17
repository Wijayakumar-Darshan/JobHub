-- ─────────────────────────────────────────────────────────────
--  Phase 2 migration: Career Key psychometric test engine
--  Run AFTER migration_phase1.sql
-- ─────────────────────────────────────────────────────────────
USE sl_job_bank;

ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS grade VARCHAR(255);

CREATE TABLE IF NOT EXISTS career_tests (
  id                  VARCHAR(36) PRIMARY KEY,
  title               VARCHAR(255) NOT NULL,
  purpose             VARCHAR(2000),
  what_it_identifies  VARCHAR(2000),
  estimated_minutes   VARCHAR(500),
  is_active           BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS career_test_questions (
  id         VARCHAR(36) PRIMARY KEY,
  test_id    VARCHAR(36) NOT NULL,
  text       VARCHAR(500) NOT NULL,
  category   VARCHAR(20) NOT NULL,   -- REALISTIC, INVESTIGATIVE, ARTISTIC, SOCIAL, ENTERPRISING, CONVENTIONAL
  sort_order INT DEFAULT 0,
  is_active  BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (test_id) REFERENCES career_tests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS career_test_attempts (
  id                            VARCHAR(36) PRIMARY KEY,
  test_id                       VARCHAR(36) NOT NULL,
  user_id                       VARCHAR(36) NOT NULL,
  status                        VARCHAR(20) DEFAULT 'IN_PROGRESS',
  started_at                    DATETIME,
  completed_at                  DATETIME NULL,
  scores_json                   VARCHAR(1000),
  holland_code                  VARCHAR(10),
  top_cluster_id                VARCHAR(36) NULL,
  guidance_text                 VARCHAR(4000),
  student_downloaded_at         DATETIME NULL,
  counselor_download_enabled    BOOLEAN DEFAULT FALSE,
  counselor_download_enabled_by VARCHAR(36) NULL,
  counselor_download_enabled_at DATETIME NULL,
  FOREIGN KEY (test_id) REFERENCES career_tests(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (top_cluster_id) REFERENCES career_clusters(id) ON DELETE SET NULL,
  INDEX idx_attempt_user (user_id),
  INDEX idx_attempt_status (status)
);

CREATE TABLE IF NOT EXISTS career_test_answers (
  id          VARCHAR(36) PRIMARY KEY,
  attempt_id  VARCHAR(36) NOT NULL,
  question_id VARCHAR(36) NOT NULL,
  value       INT NOT NULL,
  FOREIGN KEY (attempt_id) REFERENCES career_test_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES career_test_questions(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_attempt_question (attempt_id, question_id)
);

-- ── Seed: "Career Key" test with 30 questions (5 per RIASEC category) ──
INSERT INTO career_tests (id, title, purpose, what_it_identifies, estimated_minutes, is_active) VALUES
('test-career-key',
 'Career Key',
 'This short interest inventory helps you understand what kind of work genuinely interests you, before you commit to an A/L stream, degree, or job path. It is based on Holland''s RIASEC theory, used worldwide in career guidance.',
 'It identifies your top 2-3 interest areas out of six (Realistic, Investigative, Artistic, Social, Enterprising, Conventional), and matches them to career clusters and specific jobs in this system that fit those interests.',
 '10-15 minutes',
 TRUE);

INSERT INTO career_test_questions (id, test_id, text, category, sort_order, is_active) VALUES
-- Realistic
('q-r1','test-career-key','I like fixing or building mechanical things','REALISTIC',1,TRUE),
('q-r2','test-career-key','I would enjoy working outdoors rather than in an office','REALISTIC',2,TRUE),
('q-r3','test-career-key','I prefer hands-on tasks over reading theory','REALISTIC',3,TRUE),
('q-r4','test-career-key','I like operating tools, equipment, or machinery','REALISTIC',4,TRUE),
('q-r5','test-career-key','I would rather build something than talk about building it','REALISTIC',5,TRUE),
-- Investigative
('q-i1','test-career-key','I enjoy solving complex problems or puzzles','INVESTIGATIVE',6,TRUE),
('q-i2','test-career-key','I like doing research and finding out how things work','INVESTIGATIVE',7,TRUE),
('q-i3','test-career-key','I am curious about science and how the natural world works','INVESTIGATIVE',8,TRUE),
('q-i4','test-career-key','I enjoy analyzing data to find patterns','INVESTIGATIVE',9,TRUE),
('q-i5','test-career-key','I like working independently on intellectual challenges','INVESTIGATIVE',10,TRUE),
-- Artistic
('q-a1','test-career-key','I enjoy creative writing, art, music, or design','ARTISTIC',11,TRUE),
('q-a2','test-career-key','I like expressing myself in original, unconventional ways','ARTISTIC',12,TRUE),
('q-a3','test-career-key','I prefer open-ended tasks over strict step-by-step instructions','ARTISTIC',13,TRUE),
('q-a4','test-career-key','I enjoy performing, designing, or creating things for others to see','ARTISTIC',14,TRUE),
('q-a5','test-career-key','I like imagining new ideas more than following existing rules','ARTISTIC',15,TRUE),
-- Social
('q-s1','test-career-key','I enjoy helping people solve their personal problems','SOCIAL',16,TRUE),
('q-s2','test-career-key','I like teaching or explaining things to others','SOCIAL',17,TRUE),
('q-s3','test-career-key','I care deeply about making a difference in my community','SOCIAL',18,TRUE),
('q-s4','test-career-key','I enjoy working in teams and building relationships','SOCIAL',19,TRUE),
('q-s5','test-career-key','I would enjoy a career centered on caring for others','SOCIAL',20,TRUE),
-- Enterprising
('q-e1','test-career-key','I enjoy leading a group or project','ENTERPRISING',21,TRUE),
('q-e2','test-career-key','I like persuading others or selling an idea/product','ENTERPRISING',22,TRUE),
('q-e3','test-career-key','I would enjoy starting or running my own business','ENTERPRISING',23,TRUE),
('q-e4','test-career-key','I enjoy taking risks and pursuing ambitious goals','ENTERPRISING',24,TRUE),
('q-e5','test-career-key','I like being in charge and making key decisions','ENTERPRISING',25,TRUE),
-- Conventional
('q-c1','test-career-key','I like organizing information, files, or schedules','CONVENTIONAL',26,TRUE),
('q-c2','test-career-key','I prefer clear rules and structured procedures','CONVENTIONAL',27,TRUE),
('q-c3','test-career-key','I enjoy detailed, accurate work like data entry or bookkeeping','CONVENTIONAL',28,TRUE),
('q-c4','test-career-key','I like following a step-by-step plan rather than improvising','CONVENTIONAL',29,TRUE),
('q-c5','test-career-key','I feel comfortable working with numbers and precise records','CONVENTIONAL',30,TRUE);
