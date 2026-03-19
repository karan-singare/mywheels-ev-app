-- MyWheels EV Rental Platform — Seed Data
-- Run this in the Supabase SQL Editor after creating the schema.

INSERT INTO rental_plans (type, name, price, period_days, features, featured, tag) VALUES
  ('daily', 'Daily Plan', 249, 1,
   '["Perfect for trying before committing", "No minimum period required", "Pay as you go flexibility", "Ideal for part-time riders"]',
   false, null),
  ('weekly', 'Weekly Plan', 1499, 7,
   '["Ideal for short-term or trial usage", "7-day rental period", "Great for testing the fit", "No long-term commitment"]',
   false, null),
  ('monthly', 'Monthly Plan', 4999, 30,
   '["Most preferred by delivery partners", "30-day rental period", "Predictable monthly expense", "Priority support included"]',
   true, 'Best for Full-Time Riders');
