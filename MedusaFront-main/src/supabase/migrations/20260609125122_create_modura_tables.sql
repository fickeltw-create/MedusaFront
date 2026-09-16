
-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('quote', 'financing', 'distributor', 'installer', 'contact')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  model TEXT,
  budget TEXT,
  region TEXT,
  partnership_type TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  model TEXT NOT NULL,
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  amount INTEGER NOT NULL DEFAULT 100000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Distributor accounts table
CREATE TABLE IF NOT EXISTS distributor_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  region TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributor_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads (public can insert, only authenticated can read)
CREATE POLICY "leads_insert_public" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "leads_select_auth" ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "leads_update_auth" ON leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "leads_delete_auth" ON leads FOR DELETE TO authenticated USING (true);

-- RLS Policies for reservations
CREATE POLICY "reservations_insert_public" ON reservations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "reservations_select_auth" ON reservations FOR SELECT TO authenticated USING (true);
CREATE POLICY "reservations_update_auth" ON reservations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "reservations_delete_auth" ON reservations FOR DELETE TO authenticated USING (true);

-- RLS Policies for distributor_accounts
CREATE POLICY "distributor_insert_public" ON distributor_accounts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "distributor_select_own" ON distributor_accounts FOR SELECT TO authenticated USING (true);
CREATE POLICY "distributor_update_own" ON distributor_accounts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "distributor_delete_auth" ON distributor_accounts FOR DELETE TO authenticated USING (true);
