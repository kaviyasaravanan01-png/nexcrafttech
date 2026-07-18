-- ============================================================
-- Contact form inquiries — NexCraft Tech
-- Run in Supabase SQL Editor: https://supabase.com/dashboard
-- Project → SQL Editor → New query → paste & Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.inquiries (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  company    TEXT,
  service    TEXT NOT NULL,
  budget     TEXT,
  message    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_email_idx ON public.inquiries (email);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Contact form uses the public anon key — allow inserts only
DROP POLICY IF EXISTS "Allow anonymous insert on inquiries" ON public.inquiries;
CREATE POLICY "Allow anonymous insert on inquiries"
  ON public.inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users (you, logged into Supabase dashboard) can read rows
DROP POLICY IF EXISTS "Allow authenticated read on inquiries" ON public.inquiries;
CREATE POLICY "Allow authenticated read on inquiries"
  ON public.inquiries
  FOR SELECT
  TO authenticated
  USING (true);
