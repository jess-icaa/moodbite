import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry } from '@/lib/types';
import { moods } from '@/lib/data';

const MOOD_VALUE: Record<string, number> = {
  'light': 5,
  'adventurous': 4,
  'focused': 3,
  'comforting': 2,
  'low-energy': 1,
  'overwhelmed': 0,
};

interface Props { history: MoodEntry[] }

export function MoodTimelineChart({ history }: Props) {
  if (history.length < 2) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        Need at least 2 check-ins to show a timeline. Keep going! 📈
      </div>
    );
  }

  const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp).slice(-30);

  const data = sorted.map(entry => {
    const mood = moods.find(m => m.id === entry.mood);
    return {
      date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: MOOD_VALUE[entry.mood] ?? 2,
      mood: mood?.label || entry.mood,
      emoji: mood?.emoji || '😐',
    };
  });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
        <defs>
          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(340, 60%, 55%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(340, 60%, 55%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          domain={[0, 5]}
          ticks={[0, 1, 2, 3, 4, 5]}
          tickFormatter={(v) => ['😩', '🥱', '🥹', '🧠', '✨', '😁'][v] || ''}
        />
        <Tooltip
          contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 32px -8px rgba(0,0,0,0.1)', fontSize: 13 }}
          formatter={(_: unknown, __: unknown, props: { payload: { mood: string; emoji: string } }) => [
            `${props.payload.emoji} ${props.payload.mood}`, 'Mood'
          ]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(340, 60%, 55%)"
          strokeWidth={2.5}
          fill="url(#moodGradient)"
          dot={{ r: 4, fill: 'hsl(340, 60%, 55%)', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
