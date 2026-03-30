import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, TrendingUp, MessageCircle } from 'lucide-react';
import { store } from '@/lib/store';
import { MoodFrequencyChart } from '@/components/charts/MoodFrequencyChart';
import { MoodTimelineChart } from '@/components/charts/MoodTimelineChart';
import { FoodMoodCorrelation } from '@/components/charts/FoodMoodCorrelation';
import { ComfortEnergyTrend } from '@/components/charts/ComfortEnergyTrend';

type Range = '7d' | '30d' | 'all';

export default function Analytics() {
  const [range, setRange] = useState<Range>('30d');

  const allHistory = store.getHistory();
  const allFeedback = store.getFeedback();

  const history = useMemo(() => {
    if (range === 'all') return allHistory;
    const cutoff = Date.now() - (range === '7d' ? 7 : 30) * 24 * 60 * 60 * 1000;
    return allHistory.filter(h => h.timestamp > cutoff);
  }, [range, allHistory]);

  const feedback = useMemo(() => {
    if (range === 'all') return allFeedback;
    const cutoff = Date.now() - (range === '7d' ? 7 : 30) * 24 * 60 * 60 * 1000;
    return allFeedback.filter(f => f.timestamp > cutoff);
  }, [range, allFeedback]);

  const totalCheckins = history.length;
  const uniqueMoods = new Set(history.map(h => h.mood)).size;
  const topMood = history.length > 0
    ? Object.entries(
        history.reduce<Record<string, number>>((acc, h) => {
          acc[h.mood] = (acc[h.mood] || 0) + 1;
          return acc;
        }, {})
      ).sort(([, a], [, b]) => b - a)[0]?.[0] || '—'
    : '—';

  const ranges: { label: string; value: Range }[] = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: 'All Time', value: 'all' },
  ];

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block rounded-full border border-accent/30 px-4 py-1.5 text-xs font-semibold tracking-wider text-accent mb-6">
            INSIGHTS
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-2">
            Your Mood <span className="text-gradient italic">Analytics</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Discover patterns in how you feel and what nourishes you.
          </p>
        </motion.div>

        {/* Range Selector */}
        <div className="flex gap-2 mb-10">
          {ranges.map(r => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                range === r.value
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Calendar, label: 'Check-ins', value: totalCheckins },
            { icon: BarChart3, label: 'Unique Moods', value: uniqueMoods },
            { icon: TrendingUp, label: 'Top Mood', value: topMood },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl bg-card shadow-soft p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <stat.icon size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-card shadow-soft p-6"
          >
            <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-accent" /> Mood Frequency
            </h3>
            <MoodFrequencyChart history={history} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl bg-card shadow-soft p-6"
          >
            <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-accent" /> Mood Timeline
            </h3>
            <MoodTimelineChart history={history} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl bg-card shadow-soft p-6"
          >
            <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <MessageCircle size={18} className="text-accent" /> Feedback Breakdown
            </h3>
            <FoodMoodCorrelation feedback={feedback} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl bg-card shadow-soft p-6"
          >
            <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-accent" /> Comfort & Energy Trends
            </h3>
            <ComfortEnergyTrend history={history} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
