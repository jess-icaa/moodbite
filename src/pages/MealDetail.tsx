import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Flame, Heart as HeartIcon, Globe, Sparkles } from 'lucide-react';
import { getMealById, meals } from '@/lib/data';
import { mealImages } from '@/lib/images';
import { FavoriteButton } from '@/components/FavoriteButton';
import { FeedbackButtons } from '@/components/FeedbackButtons';
import { MealCard } from '@/components/MealCard';
import { searchMealDB } from '@/lib/mealdb';
import { Meal } from '@/lib/types';
import { SkeletonCard } from '@/components/SkeletonCard';

export default function MealDetail() {
  const { id } = useParams<{ id: string }>();
  const meal = getMealById(id || '');
  const [similarMeals, setSimilarMeals] = useState<Meal[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  // Fetch similar from MealDB
  useEffect(() => {
    if (!meal) return;
    setSimilarLoading(true);
    const searchTerm = meal.name.split(' ')[0]; // use first word of name
    searchMealDB(searchTerm).then(results => {
      setSimilarMeals(results.slice(0, 3));
      setSimilarLoading(false);
    });
  }, [meal]);

  if (!meal) return (
    <div className="min-h-screen gradient-hero flex items-center justify-center">
      <div className="text-center">
        <span className="text-5xl mb-4 block">🍽️</span>
        <p className="text-muted-foreground">Meal not found.</p>
        <Link to="/mood" className="text-accent text-sm mt-2 inline-block">Go back</Link>
      </div>
    </div>
  );

  const related = meals.filter(m => m.id !== meal.id && m.moodTags.some(t => meal.moodTags.includes(t))).slice(0, 3);
  const img = mealImages[meal.id] || meal.image;

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[50vh] overflow-hidden">
        {img ? (
          <img src={img} alt={meal.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
            <span className="text-8xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 to-foreground/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 container mx-auto">
          <Link to="/mood" className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors w-fit">
            <ArrowLeft size={16} /> back
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-black text-primary-foreground mb-2"
          >
            {meal.name}
          </motion.h1>
          <div className="flex items-center gap-3">
            <p className="text-primary-foreground/70 text-sm italic">Chosen for comfort. Take it slow.</p>
            {meal.isAIGenerated && (
              <span className="inline-flex items-center gap-1 text-xs text-primary-foreground/80 bg-white/10 rounded-full px-3 py-1">
                <Sparkles size={12} /> AI Generated
              </span>
            )}
            {meal.sourceApi === 'mealdb' && (
              <span className="inline-flex items-center gap-1 text-xs text-primary-foreground/80 bg-white/10 rounded-full px-3 py-1">
                <Globe size={12} /> TheMealDB
              </span>
            )}
          </div>
        </div>
        <div className="absolute top-6 right-6">
          <FavoriteButton mealId={meal.id} />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 -mt-8 relative z-10">
        <div className="rounded-3xl bg-card shadow-elevated p-8 md:p-12 max-w-4xl mx-auto space-y-10">
          {/* Why this works */}
          <div>
            <h2 className="font-display text-lg font-bold text-foreground mb-2">Why this works for your mood</h2>
            <p className="text-muted-foreground leading-relaxed">{meal.moodReason}</p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock size={16} /> {meal.prepTime}</span>
            <span className="flex items-center gap-1.5"><HeartIcon size={16} /> Comfort {meal.comfortScore}%</span>
            <span className="flex items-center gap-1.5"><Flame size={16} /> Energy {meal.energyScore}%</span>
          </div>

          {/* Ingredients */}
          <div>
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Ingredients</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {meal.ingredients.map(ing => (
                <div key={ing} className="flex items-center gap-2 text-sm text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                  {ing}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="font-display text-lg font-bold text-foreground mb-4">How to make it</h2>
            <div className="space-y-3">
              {meal.instructions.map((step, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground mr-2">{i + 1}.</span>{step}
                </p>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          {meal.nutrition.calories > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-4">Nutrition</h2>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Calories', value: meal.nutrition.calories },
                  { label: 'Protein', value: meal.nutrition.protein },
                  { label: 'Carbs', value: meal.nutrition.carbs },
                  { label: 'Fat', value: meal.nutrition.fat },
                ].map(n => (
                  <div key={n.label} className="text-center rounded-2xl bg-secondary p-4">
                    <div className="text-lg font-bold text-foreground">{n.value}</div>
                    <div className="text-xs text-muted-foreground">{n.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">How did this feel?</p>
            <FeedbackButtons mealId={meal.id} />
          </div>
        </div>

        {/* Related Local Meals */}
        {related.length > 0 && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">You might also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((m, i) => <MealCard key={m.id} meal={m} index={i} />)}
            </div>
          </div>
        )}

        {/* Similar from MealDB */}
        <div className="max-w-4xl mx-auto mt-16 mb-20">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Globe size={20} className="text-accent" /> Explore Similar Recipes
          </h2>
          <p className="text-sm text-muted-foreground mb-6">Real recipes from around the world via TheMealDB</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : similarMeals.length > 0
                ? similarMeals.map((m, i) => <MealCard key={m.id} meal={m} index={i} />)
                : <p className="text-sm text-muted-foreground col-span-3">No similar recipes found online.</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
