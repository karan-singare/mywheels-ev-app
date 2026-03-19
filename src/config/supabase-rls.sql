-- MyWheels EV Rental Platform — Row Level Security Policies
-- Run this in the Supabase SQL Editor after creating the schema.

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: get rider id for current user
CREATE OR REPLACE FUNCTION get_rider_id()
RETURNS UUID AS $$
  SELECT id FROM riders WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- user_roles: users can read their own role, admins can read all
CREATE POLICY "Users read own role" ON user_roles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins read all roles" ON user_roles FOR SELECT USING (is_admin());

-- riders: riders read/update own profile, admins read all
CREATE POLICY "Riders read own profile" ON riders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Riders update own profile" ON riders FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Riders insert own profile" ON riders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins read all riders" ON riders FOR SELECT USING (is_admin());
CREATE POLICY "Admins update riders" ON riders FOR UPDATE USING (is_admin());

-- kyc_documents: riders manage own docs, admins read all
CREATE POLICY "Riders manage own docs" ON kyc_documents FOR ALL
  USING (rider_id = get_rider_id());
CREATE POLICY "Admins read all docs" ON kyc_documents FOR SELECT USING (is_admin());

-- kyc_reviews: riders read own reviews, admins manage all
CREATE POLICY "Riders read own reviews" ON kyc_reviews FOR SELECT
  USING (rider_id = get_rider_id());
CREATE POLICY "Admins manage reviews" ON kyc_reviews FOR ALL USING (is_admin());

-- rental_plans: everyone can read, admins manage
CREATE POLICY "Anyone reads plans" ON rental_plans FOR SELECT USING (true);
CREATE POLICY "Admins manage plans" ON rental_plans FOR ALL USING (is_admin());

-- vehicles: admins full access, riders read assigned vehicle only
CREATE POLICY "Admins manage vehicles" ON vehicles FOR ALL USING (is_admin());
CREATE POLICY "Riders read assigned vehicle" ON vehicles FOR SELECT
  USING (assigned_rider_id = get_rider_id());

-- rentals: riders read own, admins manage all
CREATE POLICY "Riders read own rentals" ON rentals FOR SELECT
  USING (rider_id = get_rider_id());
CREATE POLICY "Admins manage rentals" ON rentals FOR ALL USING (is_admin());

-- payments: riders read own, admins manage all
CREATE POLICY "Riders read own payments" ON payments FOR SELECT
  USING (rider_id = get_rider_id());
CREATE POLICY "Admins manage payments" ON payments FOR ALL USING (is_admin());

-- Supabase Storage bucket setup (run via Supabase dashboard):
-- 1. Create bucket: kyc-documents (private)
-- 2. Set max file size: 10 MB (10485760 bytes)
-- 3. Allowed MIME types: image/jpeg, image/png
-- 4. Storage policies:
--    - Riders can upload to kyc-documents/{rider_id}/ path
--    - Riders can read their own files only
--    - Admins can read all files
