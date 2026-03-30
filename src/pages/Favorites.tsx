import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { store } from '@/lib/store';
import { meals, moods } from '@/lib/data';
import { MealCard } from '@/components/MealCard';
import { EmptyState } from '@/components/EmptyState';
import { ShoppingList } from '@/components/ShoppingList';

export default function Favorites() {
  const [favIds, setFavIds] = useState<string[]>([]);
  const [tab, setTab] = useState<'saved' | 'history' | 'shopping'>('saved');
  const history = store.getHistory();

  useEffect(() => { setFavIds(store.getFavorites()); }, []);

  const favMeals = meals.filter(m => favIds.includes(m.id));

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-2">Your Food Journal</h1>
          <p className="text-muted-foreground mb-8">Saved meals, mood history, and shopping list — your personal nourishment story.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10">
          {[
            { id: 'saved' as const, label: 'Saved Meals' },
            { id: 'history' as const, label: 'Check-ins' },
            { id: 'shopping' as const, label: 'Shopping List' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Saved Meals */}
        {tab === 'saved' && (
          <section>
            {favMeals.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favMeals.map((m, i) => <MealCard key={m.id} meal={m} index={i} />)}
              </div>
            ) : (
              <EmptyState title="No saved meals yet" description="When you find something that speaks to you, tap the heart to save it here." />
            )}
          </section>
        )}

        {/* History */}
        {tab === 'history' && (
          <section>
            {history.length > 0 ? (
              <div className="space-y-3 max-w-lg">
                {history.slice(0, 20).map((entry, i) => {
                  const mood = moods.find(m => m.id === entry.mood);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 rounded-2xl bg-card shadow-soft p-4"
                    >
                      <span className="text-2xl">{mood?.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{mood?.label}</p>
                        {entry.text && (
                          <p className="text-xs text-muted-foreground italic truncate max-w-xs">"{entry.text}"</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <EmptyState title="No check-ins yet" description="Your mood journey starts with a single check-in." />
            )}
          </section>
        )}

        {/* Shopping List */}
        {tab === 'shopping' && (
          <section className="max-w-lg">
            <ShoppingList />
          </section>
        )}
      </div>
    </div>
  );
}
