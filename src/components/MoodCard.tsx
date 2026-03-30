import { motion } from 'framer-motion';
import { Mood } from '@/lib/types';

interface MoodCardProps {
  mood: Mood;
  selected?: boolean;
  onClick: () => void;
  index: number;
}

export function MoodCard({ mood, selected, onClick, index }: MoodCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-3 rounded-3xl p-8 transition-shadow duration-300 cursor-pointer text-center
        bg-${mood.color} shadow-soft hover:shadow-card
        ${selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''}`}
    >
      <span className="text-4xl">{mood.emoji}</span>
      <span className="text-sm font-medium text-foreground/80">{mood.description}</span>
    </motion.button>
  );
}
