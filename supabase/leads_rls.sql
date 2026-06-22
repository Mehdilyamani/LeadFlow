-- ── RLS: leads table ──────────────────────────────────────────────────────────
-- Each authenticated user sees only rows where client_id matches their own
-- app_metadata.client_id (set manually in Supabase Auth dashboard per user).
--
-- Run this once in the Supabase SQL editor.

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_per_client"
ON leads
FOR SELECT
TO authenticated
USING (
  client_id = (auth.jwt() -> 'app_metadata' ->> 'client_id')
);

-- ── RLS: clients table ─────────────────────────────────────────────────────────
-- Each authenticated user can only read their own agency row.

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_own_row"
ON clients
FOR SELECT
TO authenticated
USING (
  client_id = (auth.jwt() -> 'app_metadata' ->> 'client_id')
);
