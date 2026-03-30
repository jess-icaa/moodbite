import { ThumbsUp, ThumbsDown, Thermometer, Feather, Zap } from 'lucide-react';
import { store } from '@/lib/store';
import { FeedbackEntry } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

const buttons = [
  { type: 'helped' as const, icon: ThumbsUp, label: 'This helped' },
  { type: 'not-for-me' as const, icon: ThumbsDown, label: 'Not for me' },
  { type: 'warmer' as const, icon: Thermometer, label: 'Warmer' },
  { type: 'lighter' as const, icon: Feather, label: 'Lighter' },
  { type: 'quicker' as const, icon: Zap, label: 'Quicker' },
];

export function FeedbackButtons({ mealId }: { mealId: string }) {
  const send = (type: FeedbackEntry['type']) => {
    store.addFeedback({ mealId, type, timestamp: Date.now() });
    toast({ title: 'Thanks for the feedback!', description: "We'll use this to improve your suggestions." });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map(b => (
        <button
          key={b.type}
          onClick={() => send(b.type)}
          className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
        >
          <b.icon size={14} /> {b.label}
        </button>
      ))}
    </div>
  );
}
