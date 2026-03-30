import { motion } from 'framer-motion';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <span className="text-5xl mb-4">🍃</span>
      <h3 className="font-display text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </motion.div>
  );
}
