
-- Creates the api_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS api_logs (
  id BIGSERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending')),
  error_message TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS api_logs_timestamp_idx ON api_logs (timestamp);
CREATE INDEX IF NOT EXISTS api_logs_status_idx ON api_logs (status);
CREATE INDEX IF NOT EXISTS api_logs_endpoint_idx ON api_logs (endpoint);
