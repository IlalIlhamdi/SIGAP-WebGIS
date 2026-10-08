import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  cleanUrl && 
  supabaseAnonKey && 
  cleanUrl !== 'https://your-project.supabase.co' &&
  !cleanUrl.includes('your-project')
);

// Fallback dummy client if credentials are empty to avoid crash
export const supabase = isSupabaseConfigured
  ? createClient(cleanUrl, supabaseAnonKey)
  : (null as any);
