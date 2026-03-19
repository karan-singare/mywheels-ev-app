import { supabase } from '../config/supabase.constant';
import type { AuthResponse, Session } from '@supabase/supabase-js';

export async function signUpWithPhone(
  phone: string,
  password: string,
): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
  });
  if (error) throw new Error(error.message);
  return { data, error: null } as AuthResponse;
}

export async function signInWithPhone(
  phone: string,
  password: string,
): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    phone,
    password,
  });
  if (error) throw new Error(error.message);
  return { data, error: null } as AuthResponse;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return { data, error: null } as AuthResponse;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

export function onAuthStateChange(
  callback: (session: Session | null) => void,
) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return data.subscription;
}

export async function refreshSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) throw new Error(error.message);
  return data.session;
}
