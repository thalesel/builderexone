
-- NOTE: 'users' table already exists in public schema (created separately)
-- We need to ensure 'sites' works with it.

-- Support Numbers Table
CREATE TABLE IF NOT EXISTS support_numbers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  numero TEXT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
);

-- App Config Table
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE support_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
-- Note: 'sites' and 'users' already exist, so we enable RLS if not enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Policies
-- Support Numbers: Public can read active. Admin can manage.
CREATE POLICY "Public can read active support" ON support_numbers FOR SELECT USING (ativo = true);
-- Assuming Admin definition is in users table role field
CREATE POLICY "Admins can manage support" ON support_numbers FOR ALL USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- App Config: Public read live help? No, only authenticated or explicit call.
-- Actually public site might need live help number? No, Dashboard uses it.
CREATE POLICY "Authenticated users read config" ON app_config FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update config" ON app_config FOR UPDATE USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);
