import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { MoodEntry, FeedbackEntry, UserPreferences } from './types';

let supabase: SupabaseClient | null = null;

export function getSupabaseConfig(): { url: string; anonKey: string } {
  return {
    url: localStorage.getItem('moodbite-supabase-url') || '',
    anonKey: localStorage.getItem('moodbite-supabase-key') || '',
  };
}

export function setSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem('moodbite-supabase-url', url);
  localStorage.setItem('moodbite-supabase-key', anonKey);
  supabase = url && anonKey ? createClient(url, anonKey) : null;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return !!(url && anonKey);
}

export function getSupabase(): SupabaseClient | null {
  if (!supabase) {
    const { url, anonKey } = getSupabaseConfig();
    if (url && anonKey) {
      supabase = createClient(url, anonKey);
    }
  }
  return supabase;
}

// ─── Auth ────────────────────────────────────────────

export async function signInWithGoogle() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) console.error('Sign in error:', error);
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    // Try sign up if user doesn't exist
    const { data: signUpData, error: signUpError } = await sb.auth.signUp({ email, password });
    if (signUpError) throw signUpError;
    return signUpData;
  }
  return data;
}

export async function signOut() {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}

export async function getUser(): Promise<User | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data.user;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  const sb = getSupabase();
  if (!sb) return { data: { subscription: { unsubscribe: () => {} } } };
  return sb.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}

// ─── Cloud Sync ──────────────────────────────────────

export async function syncFavorites(userId: string, favorites: string[]): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from('favorites').upsert(
    { user_id: userId, meal_ids: favorites, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
}

export async function fetchFavorites(userId: string): Promise<string[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb.from('favorites').select('meal_ids').eq('user_id', userId).single();
  return data?.meal_ids || [];
}

export async function syncHistory(userId: string, entries: MoodEntry[]): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from('mood_history').upsert(
    { user_id: userId, entries, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
}

export async function fetchHistory(userId: string): Promise<MoodEntry[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb.from('mood_history').select('entries').eq('user_id', userId).single();
  return data?.entries || [];
}

export async function syncPreferences(userId: string, prefs: UserPreferences): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from('preferences').upsert(
    { user_id: userId, prefs, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
}

export async function fetchPreferences(userId: string): Promise<UserPreferences | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.from('preferences').select('prefs').eq('user_id', userId).single();
  return data?.prefs || null;
}

export async function syncFeedback(userId: string, feedback: FeedbackEntry[]): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from('feedback').upsert(
    { user_id: userId, entries: feedback, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
}

export async function fetchFeedback(userId: string): Promise<FeedbackEntry[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb.from('feedback').select('entries').eq('user_id', userId).single();
  return data?.entries || [];
}

// ─── SQL Schema (for reference) ──────────────────────
// Run this in Supabase SQL editor:
/*
CREATE TABLE favorites (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_ids JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mood_history (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  entries JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  prefs JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE feedback (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  entries JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own data
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own history" ON mood_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own preferences" ON preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own feedback" ON feedback FOR ALL USING (auth.uid() = user_id);
*/
