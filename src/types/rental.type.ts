import { PlanType } from '../enums/plan-type.enum';
import { RentalStatus } from '../enums/rental-status.enum';

export interface RentalPlan {
  id: string;
  type: PlanType;
  name: string;
  price: number;
  period_days: number;
  features: string[];
  featured: boolean;
  tag: string | null;
}

export interface Rental {
  id: string;
  rider_id: string;
  vehicle_id: string;
  plan_id: string;
  plan_type: PlanType;
  start_date: string;
  end_date: string;
  status: RentalStatus;
  amount_paid: number;
  created_at: string;
}
