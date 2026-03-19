-- MyWheels EV Rental Platform — Database Schema
-- Run this in the Supabase SQL Editor to create all tables.

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles table (links auth.users to app roles)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('rider', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rider profiles
CREATE TABLE riders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT 'Hyderabad',
  emergency_contact TEXT NOT NULL DEFAULT '',
  kyc_status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (kyc_status IN ('not_started', 'in_progress', 'under_review', 'approved', 'rejected')),
  onboarding_step TEXT NOT NULL DEFAULT 'personal_info'
    CHECK (onboarding_step IN ('personal_info', 'address', 'emergency_contact', 'completed')),
  profile_completion INTEGER NOT NULL DEFAULT 0 CHECK (profile_completion BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC documents
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL
    CHECK (document_type IN ('aadhaar', 'driving_license', 'photo', 'address_proof')),
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (rider_id, document_type)
);

-- KYC reviews
CREATE TABLE kyc_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  reviewed_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'under_review'
    CHECK (status IN ('under_review', 'approved', 'rejected')),
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Rental plans (seed data table)
CREATE TABLE rental_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  period_days INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  tag TEXT
);

-- Vehicles
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id TEXT UNIQUE NOT NULL,
  model TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  battery_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'rented', 'maintenance')),
  assigned_rider_id UUID REFERENCES riders(id),
  maintenance_reason TEXT,
  last_gps_lat DOUBLE PRECISION,
  last_gps_lng DOUBLE PRECISION,
  last_gps_timestamp TIMESTAMPTZ,
  last_battery_percentage INTEGER CHECK (last_battery_percentage BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rentals
CREATE TABLE rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID NOT NULL REFERENCES riders(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  plan_id UUID NOT NULL REFERENCES rental_plans(id),
  plan_type TEXT NOT NULL CHECK (plan_type IN ('daily', 'weekly', 'monthly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'expired', 'cancelled')),
  amount_paid INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (end_date > start_date)
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID NOT NULL REFERENCES riders(id),
  rental_id UUID REFERENCES rentals(id),
  plan_id UUID NOT NULL REFERENCES rental_plans(id),
  amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL
    CHECK (payment_method IN ('upi', 'debit_card', 'credit_card', 'net_banking')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'success', 'failed')),
  gateway_transaction_id TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_riders_user_id ON riders(user_id);
CREATE INDEX idx_riders_kyc_status ON riders(kyc_status);
CREATE INDEX idx_kyc_documents_rider_id ON kyc_documents(rider_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_assigned_rider ON vehicles(assigned_rider_id);
CREATE INDEX idx_rentals_rider_id ON rentals(rider_id);
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_payments_rider_id ON payments(rider_id);
