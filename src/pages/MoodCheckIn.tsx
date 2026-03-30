import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { moods, mapTextToMood } from '@/lib/data';
import { store } from '@/lib/store';
import { MoodCard } from '@/components/MoodCard';
import { MoodId } from '@/lib/types';
import { isGeminiConfigured, analyzeMoodText } from '@/lib/gemini';

export default function MoodCheckIn() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<MoodId | null>(null);
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState('');

  const go = (mood: MoodId) => {
    store.addHistory({ mood, text: text || undefined, timestamp: Date.now(), recommendations: [] });
    navigate(`/results/${mood}`);
  };

  const handleSelect = (id: MoodId) => {
    setSelected(id);
    setTimeout(() => go(id), 300);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);

    if (isGeminiConfigured()) {
      try {
        const result = await analyzeMoodText(text);
        setAiInsight(result.insight);
        setTimeout(() => go(result.mood), 800);
      } catch {
        // Fallback to regex
        go(mapTextToMood(text));
      }
    } else {
      go(mapTextToMood(text));
    }
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-block rounded-full border border-accent/30 px-4 py-1.5 text-xs font-semibold tracking-wider text-accent mb-6">
            CHECK IN
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-black text-foreground mb-4">
            How are you,<br />really?
          </h1>
          <p className="text-muted-foreground max-w-lg mb-12 leading-relaxed">
            You don't need to be precise. Choose the mood that feels closest — not
            the one you think you *should* be in.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {moods.map((m, i) => (
            <MoodCard key={m.id} mood={m} selected={selected === m.id} onClick={() => handleSelect(m.id)} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-xl"
        >
          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
            Or tell us how you feel…
            {isGeminiConfigured() && (
              <span className="inline-flex items-center gap-1 text-xs text-accent">
                <Sparkles size={12} /> AI-Powered
              </span>
            )}
          </p>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                placeholder="I feel tired and stressed..."
                className="w-full rounded-full bg-card shadow-soft pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAnalyze}
              disabled={analyzing}
              className="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-60"
            >
              {analyzing ? (
                <span className="flex items-center gap-2">
                  <Sparkles size={14} className="animate-spin-slow" /> Analyzing...
                </span>
              ) : (
                'Analyze my mood'
              )}
            </motion.button>
          </div>
          {aiInsight && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-accent italic bg-accent/5 rounded-2xl px-4 py-3"
            >
              💡 {aiInsight}
            </motion.p>
          )}
        </motion.div>

        <p className="text-xs text-accent/60 italic mt-12">Trust your first instinct.</p>
      </div>
    </div>
  );
}
