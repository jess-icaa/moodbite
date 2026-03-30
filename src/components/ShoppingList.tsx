import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Copy, Trash2 } from 'lucide-react';
import { store } from '@/lib/store';
import { meals } from '@/lib/data';
import { toast } from '@/hooks/use-toast';

interface ShoppingItem {
  ingredient: string;
  fromMeal: string;
  checked: boolean;
}

export function ShoppingList() {
  const favIds = store.getFavorites();
  const favMeals = meals.filter(m => favIds.includes(m.id));

  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('moodbite-shopping');
    if (saved) return JSON.parse(saved);
    return favMeals.flatMap(meal =>
      meal.ingredients.map(ing => ({
        ingredient: ing,
        fromMeal: meal.name,
        checked: false,
      }))
    );
  });

  const save = (newItems: ShoppingItem[]) => {
    setItems(newItems);
    localStorage.setItem('moodbite-shopping', JSON.stringify(newItems));
  };

  const toggle = (index: number) => {
    const next = [...items];
    next[index].checked = !next[index].checked;
    save(next);
  };

  const removeChecked = () => {
    save(items.filter(i => !i.checked));
  };

  const regenerate = () => {
    const newItems = favMeals.flatMap(meal =>
      meal.ingredients.map(ing => ({
        ingredient: ing,
        fromMeal: meal.name,
        checked: false,
      }))
    );
    save(newItems);
  };

  const copyToClipboard = () => {
    const text = items
      .filter(i => !i.checked)
      .map(i => `☐ ${i.ingredient} (${i.fromMeal})`)
      .join('\n');
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied! 📋', description: 'Shopping list copied to clipboard.' });
  };

  const checkedCount = items.filter(i => i.checked).length;

  const groupedByMeal = useMemo(() => {
    const groups: Record<string, ShoppingItem[]> = {};
    items.forEach((item, i) => {
      if (!groups[item.fromMeal]) groups[item.fromMeal] = [];
      groups[item.fromMeal].push({ ...item, ingredient: `${i}::${item.ingredient}` });
    });
    return groups;
  }, [items]);

  if (items.length === 0 && favMeals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        <ShoppingCart size={32} className="mx-auto mb-3 opacity-40" />
        Save some meals first, then generate your shopping list!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <ShoppingCart size={18} className="text-accent" /> Shopping List
          </h3>
          <p className="text-xs text-muted-foreground">
            {items.length - checkedCount} items remaining · {checkedCount} checked
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyToClipboard} className="rounded-full bg-secondary p-2 hover:bg-muted transition-colors" title="Copy">
            <Copy size={14} className="text-secondary-foreground" />
          </button>
          <button onClick={removeChecked} className="rounded-full bg-secondary p-2 hover:bg-muted transition-colors" title="Remove checked">
            <Trash2 size={14} className="text-secondary-foreground" />
          </button>
          <button onClick={regenerate} className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors">
            Regenerate
          </button>
        </div>
      </div>

      {/* List by Meal */}
      {Object.entries(groupedByMeal).map(([mealName, mealItems]) => (
        <div key={mealName}>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{mealName}</p>
          <div className="space-y-1.5">
            <AnimatePresence>
              {mealItems.map(item => {
                const [idxStr, ...ingParts] = item.ingredient.split('::');
                const idx = parseInt(idxStr);
                const displayIng = ingParts.join('::');
                return (
                  <motion.button
                    key={item.ingredient}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    onClick={() => toggle(idx)}
                    className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-all ${
                      items[idx]?.checked
                        ? 'bg-secondary/50 text-muted-foreground line-through'
                        : 'bg-card shadow-soft text-foreground hover:shadow-card'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      items[idx]?.checked ? 'bg-accent border-accent' : 'border-border'
                    }`}>
                      {items[idx]?.checked && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-sm">{displayIng}</span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
