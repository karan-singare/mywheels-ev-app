import type { RentalPlan } from '../types/rental.type';

export const RENTAL_PLANS: RentalPlan[] = [
  {
    id: 'plan_daily',
    type: 'daily',
    name: 'Daily Plan',
    price: 249,
    period_days: 1,
    features: [
      'Perfect for trying before committing',
      'No minimum period required',
      'Pay as you go flexibility',
      'Ideal for part-time riders',
    ],
    featured: false,
    tag: null,
  },
  {
    id: 'plan_weekly',
    type: 'weekly',
    name: 'Weekly Plan',
    price: 1499,
    period_days: 7,
    features: [
      'Ideal for short-term or trial usage',
      '7-day rental period',
      'Great for testing the fit',
      'No long-term commitment',
    ],
    featured: false,
    tag: null,
  },
  {
    id: 'plan_monthly',
    type: 'monthly',
    name: 'Monthly Plan',
    price: 4999,
    period_days: 30,
    features: [
      'Most preferred by delivery partners',
      '30-day rental period',
      'Predictable monthly expense',
      'Priority support included',
    ],
    featured: true,
    tag: 'Best for Full-Time Riders',
  },
];
