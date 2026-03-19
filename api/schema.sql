-- Wetoro Database Schema
-- This SQL creates the table for storing stone data

CREATE TABLE IF NOT EXISTS stones (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  tone_id VARCHAR(50) NOT NULL,
  tone_label VARCHAR(100) NOT NULL,
  tone_shape VARCHAR(50) NOT NULL,
  tone_color VARCHAR(50) NOT NULL,
  label VARCHAR(80),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS stones_date_idx ON stones(date);

-- Enable Row Level Security (RLS) for basic security
ALTER TABLE stones ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read stones
CREATE POLICY "Anyone can read stones"
  ON stones
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert stones
CREATE POLICY "Anyone can insert stones"
  ON stones
  FOR INSERT
  WITH CHECK (true);

-- Note: We don't allow updates or deletes to preserve the integrity of the clearing
