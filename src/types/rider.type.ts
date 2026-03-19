import { KYCStatus } from '../enums/kyc-status.enum';
import { OnboardingStep } from '../enums/onboarding-step.enum';
import { Gender } from '../enums/gender.enum';

export interface UserRoleRecord {
  id: string;
  role: 'rider' | 'admin';
  created_at: string;
}

export interface RiderProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  date_of_birth: string;
  gender: Gender;
  address: string;
  city: string;
  emergency_contact: string;
  kyc_status: KYCStatus;
  onboarding_step: OnboardingStep;
  profile_completion: number;
  created_at: string;
  updated_at: string;
}

export interface RiderProfileInput {
  full_name: string;
  phone: string;
  date_of_birth: string;
  gender: Gender;
  address: string;
  city: string;
  emergency_contact: string;
}
