
-- Creates the transaction_audits table if it doesn't exist
CREATE TABLE IF NOT EXISTS transaction_audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell', 'transfer', 'deposit', 'withdrawal')),
  asset_symbol TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  value NUMERIC NOT NULL,
  high_value BOOLEAN NOT NULL DEFAULT false,
  required_2fa BOOLEAN NOT NULL DEFAULT false,
  source_ip TEXT,
  user_agent TEXT,
  status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'failed', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS transaction_audits_user_id_idx ON transaction_audits (user_id);
CREATE INDEX IF NOT EXISTS transaction_audits_created_at_idx ON transaction_audits (created_at);
CREATE INDEX IF NOT EXISTS transaction_audits_transaction_type_idx ON transaction_audits (transaction_type);
CREATE INDEX IF NOT EXISTS transaction_audits_status_idx ON transaction_audits (status);
CREATE INDEX IF NOT EXISTS transaction_audits_asset_symbol_idx ON transaction_audits (asset_symbol);
