import { supabase } from '../config/supabase.constant';
import type { RiderProfile, RiderProfileInput } from '../types/rider.type';
import type { OnboardingStep } from '../enums/onboarding-step.enum';

export async function createProfile(
  userId: string,
  data: RiderProfileInput,
): Promise<RiderProfile> {
  const { data: profile, error } = await supabase
    .from('riders')
    .insert({ user_id: userId, ...data })
    .select()
    .single();
  if (error) throw new Error(`Failed to create rider profile: ${error.message}`);
  return profile as RiderProfile;
}

export async function getProfile(
  userId: string,
): Promise<RiderProfile | null> {
  const { data: profile, error } = await supabase
    .from('riders')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch rider profile: ${error.message}`);
  }
  return (profile as RiderProfile) ?? null;
}

export async function updateProfile(
  userId: string,
  data: Partial<RiderProfileInput>,
): Promise<RiderProfile> {
  const { data: profile, error } = await supabase
    .from('riders')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(`Failed to update rider profile: ${error.message}`);
  return profile as RiderProfile;
}

export async function getOnboardingProgress(
  userId: string,
): Promise<OnboardingStep> {
  const { data, error } = await supabase
    .from('riders')
    .select('onboarding_step')
    .eq('user_id', userId)
    .single();
  if (error) throw new Error(`Failed to fetch onboarding progress: ${error.message}`);
  return data.onboarding_step as OnboardingStep;
}
