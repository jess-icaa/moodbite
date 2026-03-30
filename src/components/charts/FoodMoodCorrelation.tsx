import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FeedbackEntry } from '@/lib/types';

const FEEDBACK_COLORS: Record<string, string> = {
  helped: '#34d399',
  'not-for-me': '#f87171',
  warmer: '#fb923c',
  lighter: '#a78bfa',
  quicker: '#60a5fa',
};

const FEEDBACK_LABELS: Record<string, string> = {
  helped: 'Helped',
  'not-for-me': 'Not for me',
  warmer: 'Want warmer',
  lighter: 'Want lighter',
  quicker: 'Want quicker',
};

interface Props { feedback: FeedbackEntry[] }

export function FoodMoodCorrelation({ feedback }: Props) {
  if (feedback.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        Rate some meals to see your food preferences! 🍽️
      </div>
    );
  }

  const counts: Record<string, number> = {};
  feedback.forEach(f => { counts[f.type] = (counts[f.type] || 0) + 1; });

  const data = Object.entries(counts).map(([type, count]) => ({
    name: FEEDBACK_LABELS[type] || type,
    value: count,
    fill: FEEDBACK_COLORS[type] || '#94a3b8',
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 32px -8px rgba(0,0,0,0.1)', fontSize: 13 }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
