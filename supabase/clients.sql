-- LeadFlow clients table
-- One row per embedded client. client_id matches data-client-id on their <script> tag.
-- description is free-text injected into the Gemini system prompt for Entry 1 (general widget,
-- no specific property open). Leave empty string to use the generic no-hallucination fallback.

CREATE TABLE IF NOT EXISTS clients (
  client_id    text        PRIMARY KEY,
  agency_name  text        NOT NULL,
  description  text        NOT NULL DEFAULT '',
  created_at   timestamptz DEFAULT now()
);

-- Example row:
-- INSERT INTO clients (client_id, agency_name, description) VALUES (
--   'test-agency',
--   'Test Agency',
--   'Spécialisé dans les appartements et villas à Casablanca, budget moyen 1.5M-5M MAD, biens phares en bord de mer à Aïn Diab.'
-- );
