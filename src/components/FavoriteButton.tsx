import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { store } from '@/lib/store';

export function FavoriteButton({ mealId }: { mealId: string }) {
  const [fav, setFav] = useState(false);

  useEffect(() => { setFav(store.isFavorite(mealId)); }, [mealId]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.toggleFavorite(mealId);
    setFav(!fav);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={toggle}
      className="rounded-full p-2.5 glass shadow-soft transition-colors"
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart size={20} className={fav ? 'fill-accent text-accent' : 'text-muted-foreground'} />
    </motion.button>
  );
}
