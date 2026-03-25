import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/auth.service';
import { supabase } from '../../config/supabase.constant';
import { clearPersistedState } from '../middleware/mmkv-persistence.middleware';
import { setSession, setUser, setRole, clearAuth } from '../slices/auth.slice';
import type { AppDispatch } from '../index';

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (
    { phone, password }: { phone: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.signInWithPhone(phone, password);
      return {
        session: response.data.session,
        user: response.data.user,
        role: 'rider' as const,
      };
    } catch (error) {
      console.error('[auth/signIn]', error);
      return rejectWithValue((error as Error).message);
    }
  },
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    { phone, password }: { phone: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.signUpWithPhone(phone, password);
      return {
        session: response.data.session,
        user: response.data.user,
      };
    } catch (error) {
      console.error('[auth/signUp]', error);
      return rejectWithValue((error as Error).message);
    }
  },
);

export const adminSignIn = createAsyncThunk(
  'auth/adminSignIn',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.signInWithEmail(email, password);
      return {
        session: response.data.session,
        user: response.data.user,
        role: 'admin' as const,
      };
    } catch (error) {
      console.error('[auth/adminSignIn]', error);
      return rejectWithValue((error as Error).message);
    }
  },
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await authService.signOut();
      clearPersistedState();
    } catch (error) {
      console.error('[auth/signOut]', error);
      return rejectWithValue((error as Error).message);
    }
  },
);

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const session = await authService.getSession();
      if (!session) {
        return { session: null, user: null, role: null };
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (roleError) {
        return { session, user: session.user, role: null };
      }

      return {
        session,
        user: session.user,
        role: roleData.role as 'rider' | 'admin',
      };
    } catch (error) {
      console.error('[auth/restoreSession]', error);
      return rejectWithValue((error as Error).message);
    }
  },
);

/**
 * Subscribes to Supabase onAuthStateChange events and dispatches
 * session updates to the Redux store. Also handles silent token refresh
 * when the session is refreshed by Supabase (e.g., TOKEN_REFRESHED event).
 *
 * Returns an unsubscribe function to tear down the listener.
 */
export function subscribeToAuthChanges(dispatch: AppDispatch) {
  const subscription = authService.onAuthStateChange(async (session) => {
    if (session) {
      dispatch(setSession(session as unknown as Record<string, unknown>));
      dispatch(setUser(session.user as unknown as Record<string, unknown>));

      // Look up role for the authenticated user
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      dispatch(setRole((roleData?.role as 'rider' | 'admin') ?? null));
    } else {
      dispatch(clearAuth());
    }
  });

  return () => subscription.unsubscribe();
}

/**
 * Attempts a silent token refresh. Falls back to clearing auth
 * (which navigates to landing) on failure.
 */
export const refreshSessionThunk = createAsyncThunk(
  'auth/refreshSession',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const session = await authService.refreshSession();
      if (!session) {
        dispatch(clearAuth());
        clearPersistedState();
        return rejectWithValue('Session expired');
      }
      return {
        session,
        user: session.user,
      };
    } catch {
      dispatch(clearAuth());
      clearPersistedState();
      return rejectWithValue('Token refresh failed');
    }
  },
);
