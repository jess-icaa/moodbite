import { motion } from 'framer-motion';
import { Clock, Flame, Heart, Sparkles, Globe } from 'lucide-react';
import { Meal } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { mealImages } from '@/lib/images';

interface MealCardProps {
  meal: Meal;
  index: number;
}

export function MealCard({ meal, index }: MealCardProps) {
  const navigate = useNavigate();
  const img = mealImages[meal.id] || meal.image;

  const handleClick = () => {
    // For MealDB meals, store them temporarily so MealDetail can find them
    if (meal.sourceApi === 'mealdb' || meal.isAIGenerated) {
      const stored = JSON.parse(localStorage.getItem('moodbite-temp-meals') || '{}');
      stored[meal.id] = meal;
      localStorage.setItem('moodbite-temp-meals', JSON.stringify(stored));
    }
    navigate(`/meal/${meal.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6 }}
      onClick={handleClick}
      className="group cursor-pointer rounded-3xl bg-card shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        {img ? (
          <img
            src={img}
            alt={meal.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/10 to-primary/5 flex items-center justify-center">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
        {/* Source badge */}
        {meal.isAIGenerated && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium text-accent">
            <Sparkles size={12} /> AI
          </div>
        )}
        {meal.sourceApi === 'mealdb' && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium text-blue-600">
            <Globe size={12} /> MealDB
          </div>
        )}
      </div>
      <div className="p-6 space-y-3">
        <h3 className="font-display text-xl font-bold text-foreground">{meal.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{meal.moodReason}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock size={14} /> {meal.prepTime}</span>
          <span className="flex items-center gap-1"><Heart size={14} /> {meal.comfortScore}%</span>
          <span className="flex items-center gap-1"><Flame size={14} /> {meal.energyScore}%</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {meal.tags.map(tag => (
            <span key={tag} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
