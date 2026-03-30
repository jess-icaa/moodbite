import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Globe } from 'lucide-react';
import { getRecommendations, filterOptions, moods } from '@/lib/data';
import { MealCard } from '@/components/MealCard';
import { FilterChips } from '@/components/FilterChips';
import { SkeletonCard } from '@/components/SkeletonCard';
import { MoodId, Meal } from '@/lib/types';
import { isGeminiConfigured, generateMeals } from '@/lib/gemini';
import { getMealsForMood, MOOD_TO_CATEGORIES } from '@/lib/mealdb';
import { store } from '@/lib/store';

export default function Results() {
  const { moodId } = useParams<{ moodId: string }>();
  const [filters, setFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Meal[]>([]);

  // AI meals
  const [aiMeals, setAiMeals] = useState<Meal[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // MealDB meals
  const [mealDbMeals, setMealDbMeals] = useState<Meal[]>([]);
  const [mealDbLoading, setMealDbLoading] = useState(true);

  const mood = moods.find(m => m.id === moodId);

  // Local hardcoded meals
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setResults(getRecommendations(moodId as MoodId, filters));
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [moodId, filters]);

  // TheMealDB — fetch on mount only
  useEffect(() => {
    if (!moodId) return;
    setMealDbLoading(true);
    getMealsForMood(moodId as MoodId, 6).then(meals => {
      // Store them so MealDetail can look them up
      const stored = JSON.parse(localStorage.getItem('moodbite-temp-meals') || '{}');
      meals.forEach(m => { stored[m.id] = m; });
      localStorage.setItem('moodbite-temp-meals', JSON.stringify(stored));
      setMealDbMeals(meals);
      setMealDbLoading(false);
    });
  }, [moodId]);

  // Gemini AI — fetch on mount only when configured
  useEffect(() => {
    if (!isGeminiConfigured() || !moodId) return;
    setAiLoading(true);
    const prefs = store.getPreferences();
    generateMeals(moodId as MoodId, prefs, 2).then(meals => {
      setAiMeals(meals);
      setAiLoading(false);
    });
  }, [moodId]);

  const handleGenerateMore = async () => {
    if (!isGeminiConfigured()) return;
    setAiLoading(true);
    const prefs = store.getPreferences();
    const newMeals = await generateMeals(moodId as MoodId, prefs, 3, 'Must be completely different from previous suggestions');
    setAiMeals(prev => [...prev, ...newMeals]);
    setAiLoading(false);
  };

  const toggle = (f: string) =>
    setFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-6 py-12">
        <Link to="/mood" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to mood check-in
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-5xl font-black text-foreground mb-2">
            Meals for when you're feeling{' '}
            <span className="text-gradient italic">{mood?.label.toLowerCase()}</span>
            {mood && <span className="ml-2 text-3xl">{mood.emoji}</span>}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg">
            Curated picks + real-world recipes chosen for your current energy.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8">
          <FilterChips options={filterOptions} selected={filters} onToggle={toggle} />
        </div>

        {/* ── Section 1: Local Curated Meals ─────────────────── */}
        <section className="mb-16">
          <h2 className="font-display text-xl font-bold text-foreground mb-5">
            ✨ Curated for your mood
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : results.map((meal, i) => <MealCard key={meal.id} meal={meal} index={i} />)
            }
          </div>
          {!loading && results.length === 0 && (
            <div className="text-center py-10">
              <span className="text-4xl mb-3 block">🍃</span>
              <p className="text-muted-foreground">No matches with those filters. Try removing one?</p>
            </div>
          )}
        </section>

        {/* ── Section 2: TheMealDB Real Recipes ──────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Globe size={20} className="text-blue-500" />
              Real-world recipes
            </h2>
            <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
              via TheMealDB · {(MOOD_TO_CATEGORIES[moodId as MoodId] || []).join(', ')}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealDbLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`mdb-${i}`} />)
              : mealDbMeals.length > 0
                ? mealDbMeals.map((meal, i) => <MealCard key={meal.id} meal={meal} index={i} />)
                : <p className="text-sm text-muted-foreground col-span-3">No real-world recipes found. Check your connection.</p>
            }
          </div>
        </motion.section>

        {/* ── Section 3: AI Generated ────────────────────────── */}
        {isGeminiConfigured() && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <Sparkles size={20} className="text-accent" />
                AI-Generated Recipes
              </h2>
              <span className="text-xs text-muted-foreground">Powered by Gemini</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiLoading && aiMeals.length === 0
                ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={`ai-${i}`} />)
                : aiMeals.map((meal, i) => <MealCard key={meal.id} meal={meal} index={i} />)
              }
            </div>
            <div className="mt-6 flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateMore}
                disabled={aiLoading}
                className="flex items-center gap-2 rounded-full bg-accent/10 px-6 py-3 text-sm font-semibold text-accent hover:bg-accent/20 transition-colors disabled:opacity-60"
              >
                {aiLoading
                  ? <><Sparkles size={14} className="animate-spin-slow" /> Generating...</>
                  : <><Sparkles size={14} /> Generate More Recipes</>
                }
              </motion.button>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
