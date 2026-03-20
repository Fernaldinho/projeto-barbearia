-- ========================================================
-- SUPABASE SaaS DATABASE STRUCTURE
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CUSTOM TYPES
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'staff');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');

-- 2. TABLES

-- Table: companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  phone TEXT,
  logo_url TEXT,
  address TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: users (Public Profile linked to Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 30, -- In minutes
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: business_hours
CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  weekday INTEGER NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE(company_id, weekday)
);

-- Table: blocked_times
CREATE TABLE blocked_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDEXES FOR PERFORMANCE & MULTI-TENANCY
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_services_company ON services(company_id);
CREATE INDEX idx_clients_company ON clients(company_id);
CREATE INDEX idx_appointments_company ON appointments(company_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_business_company ON business_hours(company_id);
CREATE INDEX idx_blocked_company ON blocked_times(company_id);


-- 4. ROW LEVEL SECURITY (RLS) policies

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;

-- Create helper function to get current user's company_id
CREATE OR REPLACE FUNCTION get_my_company()
RETURNS UUID AS $$
  SELECT company_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Policies for companies (Users can only see/update their own company)
CREATE POLICY "Users can view their own company" ON companies 
  FOR SELECT USING (id = get_my_company());

CREATE POLICY "Owners can update their company" ON companies 
  FOR UPDATE USING (id = get_my_company());

-- Allow authenticated users to create a company (needed for onboarding)
CREATE POLICY "Authenticated users can create companies" ON companies
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Multi-tenant isolation policies (Users only see data from their company)
CREATE POLICY "Tenant access: users" ON users FOR ALL USING (company_id = get_my_company());

-- Allow authenticated users to create their own user profile (needed for onboarding)
CREATE POLICY "Users can create their own profile" ON users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Tenant access: services" ON services FOR ALL USING (company_id = get_my_company());
CREATE POLICY "Tenant access: clients" ON clients FOR ALL USING (company_id = get_my_company());
CREATE POLICY "Tenant access: appointments" ON appointments FOR ALL USING (company_id = get_my_company());
CREATE POLICY "Tenant access: business_hours" ON business_hours FOR ALL USING (company_id = get_my_company());
CREATE POLICY "Tenant access: blocked_times" ON blocked_times FOR ALL USING (company_id = get_my_company());


-- 5. UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at to all relevant tables
CREATE TRIGGER update_companies_modtime BEFORE UPDATE ON companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_services_modtime BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_clients_modtime BEFORE UPDATE ON clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_appointments_modtime BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
