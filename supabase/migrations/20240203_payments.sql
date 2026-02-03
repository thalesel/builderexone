
-- Payments Table
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('plano', 'slot', 'live_help')),
  valor INTEGER NOT NULL, -- In cents
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- Users can read their own payments
CREATE POLICY "Users can read own payments" ON pagamentos FOR SELECT USING (auth.uid() = user_id);

-- Only service role (Edge Functions) can insert/update payments (we don't give write access to auth users for this)
-- But initially, we might not need explicit policy for service_role as it bypasses RLS. 
-- So we just need to ensure users CANT insert.

-- RPC for atomic increment
CREATE OR REPLACE FUNCTION increment_slots(p_user_id uuid, count int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users
  SET slots_total = slots_total + count
  WHERE id = p_user_id;
END;
$$;
