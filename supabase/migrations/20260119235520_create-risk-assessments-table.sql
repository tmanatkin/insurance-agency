-- Create risk_assessments table to store user risk assessments
CREATE TABLE IF NOT EXISTS risk_assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  risk_category text NOT NULL CHECK (risk_category IN ('Low Risk', 'Medium Risk', 'High Risk')),
  answers jsonb NOT NULL,
  insight text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index on user_id and created_at for efficient queries
CREATE INDEX idx_risk_assessments_user_id_created_at 
  ON risk_assessments(user_id, created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own risk assessments
CREATE POLICY "Users can view their own risk assessments"
  ON risk_assessments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own risk assessments
CREATE POLICY "Users can insert their own risk assessments"
  ON risk_assessments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own risk assessments
CREATE POLICY "Users can update their own risk assessments"
  ON risk_assessments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
