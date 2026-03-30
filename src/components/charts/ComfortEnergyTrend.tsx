import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MoodEntry } from '@/lib/types';
import { getMealById } from '@/lib/data';

interface Props { history: MoodEntry[] }

export function ComfortEnergyTrend({ history }: Props) {
  const withMeals = history.filter(h => h.recommendations.length > 0 || h.mealChosen);

  if (withMeals.length < 2) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        Choose more meals to see comfort & energy trends! ⚡
      </div>
    );
  }

  const sorted = [...withMeals].sort((a, b) => a.timestamp - b.timestamp).slice(-20);

  const data = sorted.map(entry => {
    const mealId = entry.mealChosen || entry.recommendations[0];
    const meal = mealId ? getMealById(mealId) : null;
    return {
      date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      comfort: meal?.comfortScore || 50,
      energy: meal?.energyScore || 50,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip
          contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 32px -8px rgba(0,0,0,0.1)', fontSize: 13 }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="comfort" stroke="#f472b6" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 2 }} name="Comfort" />
        <Line type="monotone" dataKey="energy" stroke="#34d399" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 2 }} name="Energy" />
      </LineChart>
    </ResponsiveContainer>
  );
}
