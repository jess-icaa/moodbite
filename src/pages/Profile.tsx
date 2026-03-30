import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { store } from '@/lib/store';
import { UserPreferences } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { getGeminiKey, setGeminiKey, isGeminiConfigured } from '@/lib/gemini';
import { getSupabaseConfig, setSupabaseConfig, isSupabaseConfigured } from '@/lib/supabase';
import { Key, Database, Check, Eye, EyeOff } from 'lucide-react';

const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];
const allergyOptions = ['Nuts', 'Shellfish', 'Eggs', 'Soy', 'Wheat', 'Dairy'];
const cuisineOptions = ['Italian', 'Japanese', 'Mexican', 'Thai', 'Indian', 'Mediterranean', 'Korean', 'American'];
const goalOptions = ['Energy', 'Comfort', 'Focus', 'Lightness', 'Recovery', 'Indulgence'];

function TagSelect({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`rounded-full px-4 py-2 text-sm transition-all
              ${selected.includes(opt)
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const [prefs, setPrefs] = useState<UserPreferences>(store.getPreferences());
  const [geminiKey, setGeminiKeyState] = useState(getGeminiKey());
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(getSupabaseConfig().url);
  const [supabaseKey, setSupabaseKeyState] = useState(getSupabaseConfig().anonKey);
  const [showSupabaseKey, setShowSupabaseKey] = useState(false);

  useEffect(() => { store.setPreferences(prefs); }, [prefs]);

  const save = () => {
    store.setPreferences(prefs);
    toast({ title: 'Preferences saved ✨', description: 'Your recommendations will reflect these choices.' });
  };

  const saveGemini = () => {
    setGeminiKey(geminiKey);
    toast({ title: 'Gemini key saved 🧠', description: 'AI-powered features are now active!' });
  };

  const saveSupabase = () => {
    setSupabaseConfig(supabaseUrl, supabaseKey);
    toast({ title: 'Supabase configured ☁️', description: 'Cloud sync is now enabled. Reload to connect.' });
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-6 py-16 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-2">Your Settings</h1>
          <p className="text-muted-foreground mb-12">
            Preferences, API keys, and integrations — all in one place.
          </p>
        </motion.div>

        {/* API Keys Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-card shadow-card p-8 mb-8 space-y-8"
        >
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Key size={20} className="text-accent" /> API Integrations
          </h2>

          {/* Gemini */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Google Gemini AI</h3>
                <p className="text-xs text-muted-foreground">Powers AI recipe generation and smart mood analysis</p>
              </div>
              {isGeminiConfigured() && (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 rounded-full px-3 py-1">
                  <Check size={12} /> Active
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={e => setGeminiKeyState(e.target.value)}
                  placeholder="Paste your Gemini API key..."
                  className="w-full rounded-xl bg-secondary pl-4 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
                <button
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button onClick={saveGemini} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                Save
              </button>
            </div>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent underline"
            >
              Get a free API key →
            </a>
          </div>

          {/* Supabase */}
          <div className="space-y-3 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Database size={16} /> Supabase Cloud Sync
                </h3>
                <p className="text-xs text-muted-foreground">Sync favorites, history, and preferences across devices</p>
              </div>
              {isSupabaseConfigured() && (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 rounded-full px-3 py-1">
                  <Check size={12} /> Connected
                </span>
              )}
            </div>
            <input
              type="text"
              value={supabaseUrl}
              onChange={e => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full rounded-xl bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showSupabaseKey ? 'text' : 'password'}
                  value={supabaseKey}
                  onChange={e => setSupabaseKeyState(e.target.value)}
                  placeholder="Supabase anon key..."
                  className="w-full rounded-xl bg-secondary pl-4 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
                <button
                  onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showSupabaseKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button onClick={saveSupabase} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                Save
              </button>
            </div>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent underline"
            >
              Create a free Supabase project →
            </a>
          </div>
        </motion.div>

        {/* Food Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-card shadow-card p-8 space-y-10"
        >
          <h2 className="font-display text-xl font-bold text-foreground">Food Preferences</h2>
          <TagSelect label="Dietary Preferences" options={dietaryOptions} selected={prefs.dietary}
            onChange={dietary => setPrefs(p => ({ ...p, dietary }))} />
          <TagSelect label="Allergies" options={allergyOptions} selected={prefs.allergies}
            onChange={allergies => setPrefs(p => ({ ...p, allergies }))} />
          <TagSelect label="Favorite Cuisines" options={cuisineOptions} selected={prefs.cuisines}
            onChange={cuisines => setPrefs(p => ({ ...p, cuisines }))} />
          <TagSelect label="Goals" options={goalOptions} selected={prefs.goals}
            onChange={goals => setPrefs(p => ({ ...p, goals }))} />

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={save}
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            Save preferences
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
