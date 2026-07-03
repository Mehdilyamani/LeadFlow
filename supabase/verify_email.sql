-- ── Email verification cascade — cache, domain intel, and per-provider quotas ──
-- Used exclusively by app/api/verify-email/route.ts via the service-role client.
-- Run this once in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS email_verifications (
  email      text PRIMARY KEY,
  domain     text NOT NULL,
  verdict    text NOT NULL CHECK (verdict IN ('ok', 'catch_all', 'invalid', 'unknown')),
  service    text,
  raw        jsonb,
  attempts   int NOT NULL DEFAULT 1,
  checked_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_verifications_domain_idx ON email_verifications (domain);

CREATE TABLE IF NOT EXISTS domain_status (
  domain      text PRIMARY KEY,
  is_catch_all bool,
  has_mx       bool,
  checked_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS verifier_usage (
  service  text NOT NULL,
  day      date NOT NULL,
  count    int NOT NULL DEFAULT 0,
  disabled bool NOT NULL DEFAULT false,
  PRIMARY KEY (service, day)
);

-- Internal service tables, reached only via the service-role key from the API route.
-- RLS on with no policies locks them out of the anon/authenticated Supabase clients entirely.
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_status       ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifier_usage      ENABLE ROW LEVEL SECURITY;
