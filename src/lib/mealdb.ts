import { Meal, MoodId } from './types';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

// Map each mood to the MealDB categories that best match it
export const MOOD_TO_CATEGORIES: Record<MoodId, string[]> = {
  light:        ['Seafood', 'Starter', 'Vegan', 'Vegetarian'],
  comforting:   ['Pasta', 'Dessert', 'Beef'],
  'low-energy': ['Breakfast', 'Pasta', 'Vegetarian'],
  overwhelmed:  ['Dessert', 'Vegan', 'Side'],
  focused:      ['Chicken', 'Side', 'Vegan'],
  adventurous:  ['Lamb', 'Miscellaneous', 'Pork', 'Seafood'],
};

/** Fetch real-world meals from MealDB that match a mood (fast: 2 categories × 3 meals) */
export async function getMealsForMood(mood: MoodId, count = 6): Promise<Meal[]> {
  const categories = [...(MOOD_TO_CATEGORIES[mood] || ['Chicken'])];
  // Pick 2 random categories and fetch up to 3 meals each, in parallel
  const shuffled = categories.sort(() => Math.random() - 0.5).slice(0, 2);
  try {
    const results = await Promise.all(
      shuffled.map(cat => getMealsByCategory(cat, 3))
    );
    const all = results.flat();
    // Deduplicate by id and limit to count
    const seen = new Set<string>();
    return all.filter(m => !seen.has(m.id) && seen.add(m.id)).slice(0, count);
  } catch {
    return [];
  }
}


interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strTags: string | null;
  [key: string]: string | null;
}

function extractIngredients(m: MealDBMeal): string[] {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = m[`strIngredient${i}`];
    const measure = m[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push(`${ing.trim()} — ${measure?.trim() || 'to taste'}`);
    }
  }
  return ingredients;
}

function mapMealDBCategory(category: string): MoodId[] {
  const map: Record<string, MoodId[]> = {
    Beef: ['comforting', 'focused'],
    Chicken: ['light', 'focused'],
    Dessert: ['comforting', 'overwhelmed'],
    Lamb: ['adventurous', 'comforting'],
    Miscellaneous: ['adventurous'],
    Pasta: ['comforting', 'low-energy'],
    Pork: ['comforting', 'adventurous'],
    Seafood: ['light', 'adventurous'],
    Side: ['light', 'focused'],
    Starter: ['light', 'adventurous'],
    Vegan: ['light', 'focused'],
    Vegetarian: ['light', 'focused'],
    Breakfast: ['low-energy', 'comforting'],
    Goat: ['adventurous'],
  };
  return map[category] || ['light'];
}

function transformMealDB(m: MealDBMeal): Meal {
  const instructions = m.strInstructions
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(s => s.length > 10);
  const tags = m.strTags
    ? m.strTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    : [];
  const allTags = [...new Set([...tags, m.strArea?.toLowerCase() || ''].filter(Boolean))];

  return {
    id: `mealdb-${m.idMeal}`,
    name: m.strMeal,
    image: m.strMealThumb,
    moodReason: `A ${m.strCategory?.toLowerCase() || 'delicious'} dish from ${m.strArea || 'around the world'} — explore something real and satisfying.`,
    moodTags: mapMealDBCategory(m.strCategory || ''),
    prepTime: '30 min',
    comfortScore: 70,
    energyScore: 60,
    ingredients: extractIngredients(m),
    instructions: instructions.length > 0 ? instructions : ['Follow the recipe instructions.'],
    nutrition: { calories: 0, protein: '—', carbs: '—', fat: '—' },
    tags: allTags.slice(0, 4),
    isAIGenerated: false,
    sourceApi: 'mealdb',
  };
}

export async function searchMealDB(query: string): Promise<Meal[]> {
  try {
    const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!data.meals) return [];
    return (data.meals as MealDBMeal[]).map(transformMealDB);
  } catch (e) {
    console.warn('MealDB search failed:', e);
    return [];
  }
}

export async function getMealsByCategory(category: string, limit = 8): Promise<Meal[]> {
  try {
    const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`);
    const data = await res.json();
    if (!data.meals) return [];
    // filter endpoint only returns id, name, thumb — we need full details
    const summaries = (data.meals as { idMeal: string; strMeal: string; strMealThumb: string }[]).slice(0, limit);
    const detailed = await Promise.all(
      summaries.map(async (s) => {
        try {
          const r = await fetch(`${BASE}/lookup.php?i=${s.idMeal}`);
          const d = await r.json();
          return d.meals?.[0] ? transformMealDB(d.meals[0]) : null;
        } catch { return null; }
      })
    );
    return detailed.filter(Boolean) as Meal[];
  } catch (e) {
    console.warn('MealDB category fetch failed:', e);
    return [];
  }
}

export async function getRandomMeal(): Promise<Meal | null> {
  try {
    const res = await fetch(`${BASE}/random.php`);
    const data = await res.json();
    if (!data.meals?.[0]) return null;
    return transformMealDB(data.meals[0]);
  } catch (e) {
    console.warn('MealDB random failed:', e);
    return null;
  }
}

export async function lookupMealDB(id: string): Promise<Meal | null> {
  try {
    const mealDbId = id.replace('mealdb-', '');
    const res = await fetch(`${BASE}/lookup.php?i=${mealDbId}`);
    const data = await res.json();
    if (!data.meals?.[0]) return null;
    return transformMealDB(data.meals[0]);
  } catch (e) {
    console.warn('MealDB lookup failed:', e);
    return null;
  }
}

export const mealDBCategories = [
  'Beef', 'Chicken', 'Dessert', 'Lamb', 'Pasta', 'Pork',
  'Seafood', 'Side', 'Starter', 'Vegan', 'Vegetarian', 'Breakfast', 'Miscellaneous',
];
