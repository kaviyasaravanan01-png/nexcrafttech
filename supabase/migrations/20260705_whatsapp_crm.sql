-- ============================================================
-- WhatsApp CRM Tables — NexCraft Tech
-- Run this in Supabase SQL Editor (Settings → SQL Editor)
-- All tables are prefixed with "wa_" for easy future migration
-- ============================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. wa_plans — subscription tiers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wa_plans (
  id           TEXT PRIMARY KEY,                          -- free | starter | pro | business
  name         TEXT NOT NULL,
  price_inr    INTEGER NOT NULL DEFAULT 0,
  price_usd    INTEGER NOT NULL DEFAULT 0,
  msg_per_day  INTEGER NOT NULL DEFAULT 50,
  max_contacts INTEGER NOT NULL DEFAULT 100,
  features     JSONB DEFAULT '[]',
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Seed plans
INSERT INTO public.wa_plans (id, name, price_inr, price_usd, msg_per_day, max_contacts, features)
VALUES
  ('free',     'Free',     0,    0,   50,    100,   '["50 msgs/day","100 contacts","Basic campaigns"]'),
  ('starter',  'Starter',  499,  6,   500,   1000,  '["500 msgs/day","1,000 contacts","Scheduling","Attachments"]'),
  ('pro',      'Pro',      1499, 18,  5000,  10000, '["5,000 msgs/day","10,000 contacts","Multi-device","Priority support"]'),
  ('business', 'Business', 3999, 48,  -1,    -1,    '["Unlimited messages","Unlimited contacts","API access","Dedicated support"]')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. wa_subscriptions — user subscription status
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wa_subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id         TEXT NOT NULL REFERENCES public.wa_plans(id) DEFAULT 'free',
  status          TEXT NOT NULL DEFAULT 'active',        -- active | cancelled | past_due
  razorpay_sub_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- 3. wa_sessions — WhatsApp connected sessions per user
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wa_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone       TEXT,                                      -- connected phone number
  provider    TEXT NOT NULL DEFAULT 'baileys',           -- baileys | wweb | wppconnect
  status      TEXT NOT NULL DEFAULT 'disconnected',      -- connected | disconnected | qr_pending | banned
  session_data JSONB,                                    -- encrypted session blob from Railway
  last_seen   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. wa_contacts — contact list per user
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wa_contacts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  tags        TEXT[] DEFAULT '{}',
  variables   JSONB DEFAULT '{}',                        -- custom key-value pairs for {{variable}}
  is_valid    BOOLEAN DEFAULT TRUE,                      -- false = invalid number
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, phone)
);

CREATE INDEX IF NOT EXISTS wa_contacts_user_idx ON public.wa_contacts(user_id);
CREATE INDEX IF NOT EXISTS wa_contacts_phone_idx ON public.wa_contacts(phone);

-- ============================================================
-- 5. wa_campaigns — bulk message campaigns
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wa_campaigns (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  message_template TEXT NOT NULL,
  attachments      JSONB DEFAULT '[]',                   -- [{type, url, name}]
  contact_ids      UUID[] DEFAULT '{}',
  total_contacts   INTEGER DEFAULT 0,
  sent_count       INTEGER DEFAULT 0,
  failed_count     INTEGER DEFAULT 0,
  pending_count    INTEGER DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'draft',        -- draft | queued | running | paused | completed | failed | cancelled
  delay_min_sec    INTEGER DEFAULT 2,
  delay_max_sec    INTEGER DEFAULT 8,
  spin_enabled     BOOLEAN DEFAULT TRUE,
  typing_sim       BOOLEAN DEFAULT TRUE,
  scheduled_at     TIMESTAMPTZ,                          -- null = send immediately
  started_at       TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ,
  duration_sec     INTEGER,
  error_message    TEXT,
  bull_job_id      TEXT,                                 -- BullMQ job reference
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS wa_campaigns_user_idx ON public.wa_campaigns(user_id);
CREATE INDEX IF NOT EXISTS wa_campaigns_status_idx ON public.wa_campaigns(status);

-- ============================================================
-- 6. wa_message_logs — individual message delivery records
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wa_message_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id  UUID NOT NULL REFERENCES public.wa_campaigns(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id   UUID REFERENCES public.wa_contacts(id) ON DELETE SET NULL,
  phone        TEXT NOT NULL,
  name         TEXT,
  message_sent TEXT,                                     -- actual message after spin
  status       TEXT NOT NULL DEFAULT 'pending',          -- pending | sent | failed | skipped
  error_msg    TEXT,
  sent_at      TIMESTAMPTZ,
  delay_used   INTEGER,                                  -- actual delay used (ms)
  provider     TEXT,                                     -- which provider sent it
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS wa_logs_campaign_idx ON public.wa_message_logs(campaign_id);
CREATE INDEX IF NOT EXISTS wa_logs_user_idx ON public.wa_message_logs(user_id);
CREATE INDEX IF NOT EXISTS wa_logs_status_idx ON public.wa_message_logs(status);

-- ============================================================
-- 7. wa_schedules — recurring / advanced schedule config
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wa_schedules (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id  UUID REFERENCES public.wa_campaigns(id) ON DELETE CASCADE,
  cron_expr    TEXT,                                     -- e.g. "0 9 * * 1-5" = weekdays 9am
  timezone     TEXT DEFAULT 'Asia/Kolkata',
  is_active    BOOLEAN DEFAULT TRUE,
  next_run_at  TIMESTAMPTZ,
  last_run_at  TIMESTAMPTZ,
  run_count    INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security — users can only see their own data
-- ============================================================
ALTER TABLE public.wa_subscriptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_sessions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_contacts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_campaigns       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_message_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_schedules       ENABLE ROW LEVEL SECURITY;

-- Subscriptions
CREATE POLICY "wa_sub_own" ON public.wa_subscriptions FOR ALL USING (auth.uid() = user_id);

-- Sessions
CREATE POLICY "wa_session_own" ON public.wa_sessions FOR ALL USING (auth.uid() = user_id);

-- Contacts
CREATE POLICY "wa_contacts_own" ON public.wa_contacts FOR ALL USING (auth.uid() = user_id);

-- Campaigns
CREATE POLICY "wa_campaigns_own" ON public.wa_campaigns FOR ALL USING (auth.uid() = user_id);

-- Message logs
CREATE POLICY "wa_logs_own" ON public.wa_message_logs FOR ALL USING (auth.uid() = user_id);

-- Schedules
CREATE POLICY "wa_schedules_own" ON public.wa_schedules FOR ALL USING (auth.uid() = user_id);

-- wa_plans is public read
CREATE POLICY "wa_plans_read" ON public.wa_plans FOR SELECT USING (TRUE);

-- ============================================================
-- Auto-create subscription on new user signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_wa_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.wa_subscriptions (user_id, plan_id, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_wa ON auth.users;
CREATE TRIGGER on_auth_user_created_wa
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_wa_user();
