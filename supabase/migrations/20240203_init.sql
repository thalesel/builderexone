
-- Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  slots_total INTEGER DEFAULT 0,
  slots_usados INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sites Table
CREATE TABLE sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  dominio TEXT,
  razao_social TEXT NOT NULL,
  cnpj TEXT,
  missao TEXT,
  telefones TEXT,
  email TEXT,
  instagram TEXT,
  whatsapp TEXT,
  sobre TEXT,
  rodape TEXT,
  pixel_meta TEXT,
  meta_tag TEXT,
  app_id TEXT,
  link_pagina TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Numbers Table
CREATE TABLE support_numbers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  numero TEXT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
);

-- App Config Table
CREATE TABLE app_config (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_numbers ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for demonstration)
-- Profiles: Users can read their own profile. Admin can read all.
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Sites: Public can read active sites (for PublicSite). Users can read their own. Admin can read all.
CREATE POLICY "Public can read active sites" ON sites FOR SELECT USING (ativo = true);
CREATE POLICY "Users can read own sites" ON sites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can do everything with sites" ON sites FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Support Numbers: Public can read active. Admin can manage.
CREATE POLICY "Public can read active support" ON support_numbers FOR SELECT USING (ativo = true);
CREATE POLICY "Admins can manage support" ON support_numbers FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
