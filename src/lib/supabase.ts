import { createClient } from '@supabase/supabase-js';

// Temporarily commented out environment variables to fix white screen issue
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Using hardcoded placeholder values temporarily
const supabaseUrl = 'https://placeholder.supabase.co';
const supabaseAnonKey = 'placeholder-key';

// Create a mock client if environment variables are missing
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add a flag to check if Supabase is properly configured
// export const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
export const isSupabaseConfigured = false; // Temporarily set to false
