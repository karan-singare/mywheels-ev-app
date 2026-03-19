import { MMKV } from 'react-native-mmkv';
import { Middleware } from '@reduxjs/toolkit';

const storage = new MMKV();

const PERSISTED_SLICES = ['auth', 'rider', 'kyc', 'rentals', 'vehicles'] as const;

/**
 * Persists selected slices to MMKV on every state change.
 * Payments slice is NOT persisted — always fetched fresh.
 */
export const mmkvPersistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  for (const key of PERSISTED_SLICES) {
    storage.set(`redux_${key}`, JSON.stringify(state[key]));
  }

  return result;
};

/**
 * Rehydration helper — called once at app startup before store creation.
 * Returns partial preloaded state from MMKV.
 */
export function getPersistedState(): Record<string, unknown> {
  const preloaded: Record<string, unknown> = {};

  for (const key of PERSISTED_SLICES) {
    const raw = storage.getString(`redux_${key}`);
    if (raw) {
      try {
        preloaded[key] = JSON.parse(raw);
      } catch {
        // Ignore corrupted data
      }
    }
  }

  return preloaded;
}

/**
 * Clears all persisted Redux state from MMKV.
 * Called on signOut to ensure no stale data remains.
 */
export function clearPersistedState(): void {
  for (const key of PERSISTED_SLICES) {
    storage.delete(`redux_${key}`);
  }
}
