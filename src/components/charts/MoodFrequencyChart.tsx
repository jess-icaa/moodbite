import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MoodEntry } from '@/lib/types';
import { moods } from '@/lib/data';

const MOOD_COLORS: Record<string, string> = {
  light: '#facc15',
  comforting: '#60a5fa',
  'low-energy': '#a78bfa',
  overwhelmed: '#f472b6',
  focused: '#34d399',
  adventurous: '#fb923c',
};

interface Props { history: MoodEntry[] }

export function MoodFrequencyChart({ history }: Props) {
  const counts: Record<string, number> = {};
  moods.forEach(m => { counts[m.id] = 0; });
  history.forEach(h => { counts[h.mood] = (counts[h.mood] || 0) + 1; });

  const data = moods.map(m => ({
    name: m.label,
    emoji: m.emoji,
    count: counts[m.id] || 0,
    fill: MOOD_COLORS[m.id] || '#94a3b8',
  }));

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No mood data yet. Start checking in to see your patterns! 🌱
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
        <XAxis dataKey="emoji" tick={{ fontSize: 20 }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 32px -8px rgba(0,0,0,0.1)', fontSize: 13 }}
          formatter={(value: number) => [`${value} times`, 'Check-ins']}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ''}
        />
        <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={48}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
