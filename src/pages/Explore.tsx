import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shuffle, Globe } from 'lucide-react';
import { searchMealDB, getMealsByCategory, getRandomMeal, mealDBCategories } from '@/lib/mealdb';
import { Meal } from '@/lib/types';
import { MealCard } from '@/components/MealCard';
import { SkeletonCard } from '@/components/SkeletonCard';

export default function Explore() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setCategory('');
    const meals = await searchMealDB(query.trim());
    setResults(meals);
    setLoading(false);
  };

  const handleCategory = async (cat: string) => {
    setCategory(cat);
    setQuery('');
    setLoading(true);
    setSearched(true);
    const meals = await getMealsByCategory(cat);
    setResults(meals);
    setLoading(false);
  };

  const handleRandom = async () => {
    setLoading(true);
    setSearched(true);
    const meal = await getRandomMeal();
    setResults(meal ? [meal] : []);
    setLoading(false);
  };

  // Load initial random meals
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      const promises = Array.from({ length: 6 }, () => getRandomMeal());
      const meals = (await Promise.all(promises)).filter(Boolean) as Meal[];
      setResults(meals);
      setLoading(false);
    };
    loadInitial();
  }, []);

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block rounded-full border border-accent/30 px-4 py-1.5 text-xs font-semibold tracking-wider text-accent mb-6">
            DISCOVER
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-2">
            Explore <span className="text-gradient italic">Real Recipes</span>
          </h1>
          <p className="text-muted-foreground mb-8 flex items-center gap-2">
            <Globe size={16} /> Powered by TheMealDB — 300+ recipes from around the world
          </p>
        </motion.div>

        {/* Search */}
        <div className="flex gap-3 mb-8 max-w-xl">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search recipes... e.g. chicken, pasta, sushi"
              className="w-full rounded-full bg-card shadow-soft pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            Search
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRandom}
            className="rounded-full bg-accent/10 p-3.5 text-accent hover:bg-accent/20 transition-colors"
            title="Random recipe"
          >
            <Shuffle size={18} />
          </motion.button>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          {mealDBCategories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : results.map((meal, i) => <MealCard key={meal.id} meal={meal} index={i} />)
          }
        </div>

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-muted-foreground">No recipes found. Try a different search or category!</p>
          </div>
        )}
      </div>
    </div>
  );
}
