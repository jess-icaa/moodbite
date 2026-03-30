import { motion } from 'framer-motion';

interface FilterChipsProps {
  options: readonly string[];
  selected: string[];
  onToggle: (filter: string) => void;
}

export function FilterChips({ options, selected, onToggle }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <motion.button
          key={opt}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggle(opt)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
            ${selected.includes(opt)
              ? 'bg-primary text-primary-foreground shadow-soft'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}
        >
          {opt}
        </motion.button>
      ))}
    </div>
  );
}
