import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createMMKV } from 'react-native-mmkv';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

let mmkv: ReturnType<typeof createMMKV> | null = null;

function getMMKV() {
  if (!mmkv) {
    mmkv = createMMKV({ id: 'supabase-auth' });
  }
  return mmkv;
}

const mmkvStorageAdapter = {
  getItem: (key: string): string | null => {
    return getMMKV().getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    getMMKV().set(key, value);
  },
  removeItem: (key: string): void => {
    getMMKV().remove(key);
  },
};

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: mmkvStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
