-- Create table for tracking 404 errors
CREATE TABLE IF NOT EXISTS error_404_logs (
  id SERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_error_404_logs_created_at ON error_404_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_404_logs_path ON error_404_logs(path);

-- Enable RLS
ALTER TABLE error_404_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from anyone (anonymous)
CREATE POLICY "Allow anonymous inserts" ON error_404_logs
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow select only for authenticated admins (via service role)
CREATE POLICY "Allow service role select" ON error_404_logs
  FOR SELECT TO service_role
  USING (true);

-- Auto-cleanup: Delete logs older than 30 days (optional - run as cron)
-- DELETE FROM error_404_logs WHERE created_at < NOW() - INTERVAL '30 days';
