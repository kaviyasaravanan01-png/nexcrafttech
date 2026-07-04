-- ============================================================
-- WhatsApp CRM — Payment Records Table
-- Run in Supabase SQL Editor after 20260705_whatsapp_crm.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.wa_payments (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_order_id    TEXT NOT NULL,
  razorpay_payment_id  TEXT,
  plan_id              TEXT NOT NULL REFERENCES public.wa_plans(id),
  amount               INTEGER NOT NULL,           -- in paise
  currency             TEXT NOT NULL DEFAULT 'INR',
  status               TEXT NOT NULL DEFAULT 'pending', -- pending | paid | failed | refunded
  paid_at              TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS wa_payments_user_idx  ON public.wa_payments(user_id);
CREATE INDEX IF NOT EXISTS wa_payments_order_idx ON public.wa_payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS wa_payments_status_idx ON public.wa_payments(status);

ALTER TABLE public.wa_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wa_payments_own" ON public.wa_payments FOR ALL USING (auth.uid() = user_id);
