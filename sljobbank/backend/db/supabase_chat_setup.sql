-- ─────────────────────────────────────────────────────────────
--  Run this in your Supabase project's SQL Editor (free tier is
--  plenty for this - Supabase's free plan includes Postgres +
--  Realtime at no cost).
--
--  Design: Spring Boot is the ONLY writer (using the service_role
--  key, kept server-side), so all moderation rules - "student can
--  only edit their own message", "only counselor/admin can delete" -
--  are enforced in ChatService, not here. RLS below is a second
--  line of defense in case the service key ever leaks, and it's
--  what allows the frontend to read + subscribe to live updates
--  directly using the public anon key without touching Spring Boot
--  for every message.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS chat_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id    TEXT NOT NULL,          -- SL Job Bank user id (from the main MySQL DB)
  author_name  TEXT NOT NULL,
  author_role  TEXT NOT NULL,          -- STUDENT | COUNSELOR | SUPER_ADMIN
  content      TEXT NOT NULL,
  is_deleted   BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_by   TEXT,
  deleted_at   TIMESTAMPTZ,
  edited_at    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_messages (created_at DESC);

-- Enable Realtime replication for this table (Database > Replication in the
-- Supabase dashboard also works, this does the same thing via SQL).
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone holding the anon key can READ non-deleted messages (public chat).
CREATE POLICY "public read - non-deleted messages"
  ON chat_messages FOR SELECT
  USING (is_deleted = FALSE);

-- No direct INSERT/UPDATE/DELETE policies are granted to the anon role at all -
-- every write MUST go through the Spring Boot backend (service_role key bypasses
-- RLS entirely, which is intentional: that's where the actual permission checks
-- - "own message only", "counselor/admin can delete" - live).
