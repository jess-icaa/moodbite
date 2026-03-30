import { Mood, Meal, MoodId } from './types';

export const moods: Mood[] = [
  { id: 'light', emoji: '😁', label: 'Light & Open', description: "I'm feeling light and open today.", color: 'mood-yellow' },
  { id: 'comforting', emoji: '🥹', label: 'Need Comfort', description: 'I need something comforting right now.', color: 'mood-blue' },
  { id: 'low-energy', emoji: '🥱', label: 'Low Energy', description: "I'm running low on energy.", color: 'mood-lavender' },
  { id: 'overwhelmed', emoji: '🤯', label: 'Overwhelmed', description: 'My mind feels a little overwhelmed.', color: 'mood-pink' },
  { id: 'focused', emoji: '🧠', label: 'Focused & Steady', description: 'I want to stay steady and focused.', color: 'mood-mint' },
  { id: 'adventurous', emoji: '✨', label: 'Adventurous', description: "I'm feeling curious and adventurous.", color: 'mood-peach' },
];

export const meals: Meal[] = [
  {
    id: 'fettuccine-alfredo',
    name: 'Fettuccine Alfredo',
    image: '',
    moodReason: 'Creamy, warm, and enveloping — exactly what your body is asking for when it wants to slow down and feel held.',
    moodTags: ['comforting', 'low-energy'],
    prepTime: '25 min',
    comfortScore: 95,
    energyScore: 40,
    ingredients: ['Fettuccine — 1 lb', 'Heavy Cream — 1/2 cup', 'Butter — 1/2 cup', 'Parmesan — 1/2 cup', 'Parsley — 2 tbsp', 'Black Pepper'],
    instructions: ['Cook pasta in salted boiling water until al dente.', 'Melt butter in a large skillet over medium heat.', 'Add heavy cream and simmer for 2 minutes.', 'Toss pasta in the sauce, add parmesan, and stir until silky.', 'Garnish with parsley and black pepper.'],
    nutrition: { calories: 620, protein: '18g', carbs: '72g', fat: '30g' },
    tags: ['warm', 'indulgent', 'quick'],
  },
  {
    id: 'mango-smoothie-bowl',
    name: 'Mango Smoothie Bowl',
    image: '',
    moodReason: 'Bright, refreshing, and light — this lifts your energy without weighing you down.',
    moodTags: ['light', 'focused'],
    prepTime: '10 min',
    comfortScore: 60,
    energyScore: 85,
    ingredients: ['Frozen Mango — 1 cup', 'Banana — 1', 'Greek Yogurt — 1/2 cup', 'Granola — 1/4 cup', 'Chia Seeds — 1 tbsp', 'Honey — drizzle'],
    instructions: ['Blend mango, banana, and yogurt until smooth.', 'Pour into a bowl.', 'Top with granola, chia seeds, and a drizzle of honey.'],
    nutrition: { calories: 340, protein: '14g', carbs: '58g', fat: '8g' },
    tags: ['light', 'healthy', 'quick'],
  },
  {
    id: 'chicken-pho',
    name: 'Chicken Pho',
    image: '',
    moodReason: 'A warm, restorative broth that gently brings you back to center when everything feels like too much.',
    moodTags: ['overwhelmed', 'comforting', 'low-energy'],
    prepTime: '40 min',
    comfortScore: 90,
    energyScore: 65,
    ingredients: ['Chicken Broth — 6 cups', 'Rice Noodles — 8 oz', 'Chicken Breast — 2', 'Bean Sprouts — 1 cup', 'Lime — 2', 'Sriracha — to taste', 'Fresh Basil', 'Hoisin Sauce'],
    instructions: ['Simmer broth with star anise, cinnamon, and ginger for 20 min.', 'Poach chicken in the broth, then shred.', 'Cook rice noodles separately.', 'Assemble bowls with noodles, chicken, and broth.', 'Top with sprouts, basil, lime, and sriracha.'],
    nutrition: { calories: 420, protein: '32g', carbs: '52g', fat: '8g' },
    tags: ['warm', 'healthy', 'budget'],
  },
  {
    id: 'avocado-toast-eggs',
    name: 'Avocado Toast with Soft Eggs',
    image: '',
    moodReason: 'Simple, nourishing, and grounding — the kind of meal that helps you feel steady without overthinking.',
    moodTags: ['focused', 'light'],
    prepTime: '15 min',
    comfortScore: 70,
    energyScore: 80,
    ingredients: ['Sourdough Bread — 2 slices', 'Avocado — 1', 'Eggs — 2', 'Chili Flakes', 'Lemon Juice', 'Salt & Pepper', 'Microgreens'],
    instructions: ['Toast sourdough until golden.', 'Mash avocado with lemon juice, salt, and pepper.', 'Soft boil eggs for 6.5 minutes, then halve.', 'Spread avocado on toast, add eggs, and finish with chili flakes and microgreens.'],
    nutrition: { calories: 380, protein: '16g', carbs: '32g', fat: '22g' },
    tags: ['quick', 'healthy', 'light'],
  },
  {
    id: 'thai-green-curry',
    name: 'Thai Green Curry',
    image: '',
    moodReason: 'Bold, aromatic, and exciting — perfect for when your spirit wants something vibrant and new.',
    moodTags: ['adventurous', 'focused'],
    prepTime: '35 min',
    comfortScore: 75,
    energyScore: 70,
    ingredients: ['Coconut Milk — 1 can', 'Green Curry Paste — 3 tbsp', 'Chicken or Tofu — 1 lb', 'Thai Basil', 'Bamboo Shoots', 'Bell Pepper — 1', 'Jasmine Rice'],
    instructions: ['Sauté curry paste in coconut cream until fragrant.', 'Add protein and cook through.', 'Pour in coconut milk and add vegetables.', 'Simmer for 15 minutes.', 'Serve over jasmine rice with fresh Thai basil.'],
    nutrition: { calories: 520, protein: '28g', carbs: '44g', fat: '26g' },
    tags: ['warm', 'indulgent'],
  },
  {
    id: 'honey-oat-pancakes',
    name: 'Honey Oat Pancakes',
    image: '',
    moodReason: 'Sweet, gentle, and familiar — like a warm hug on a plate when you need to decompress.',
    moodTags: ['overwhelmed', 'comforting'],
    prepTime: '20 min',
    comfortScore: 88,
    energyScore: 55,
    ingredients: ['Oat Flour — 1 cup', 'Egg — 1', 'Milk — 3/4 cup', 'Honey — 2 tbsp', 'Butter — 1 tbsp', 'Blueberries — 1/2 cup', 'Vanilla Extract'],
    instructions: ['Mix oat flour, egg, milk, honey, and vanilla.', 'Heat a non-stick pan with a little butter.', 'Pour batter and cook until bubbles form, then flip.', 'Stack and top with blueberries and a drizzle of honey.'],
    nutrition: { calories: 360, protein: '12g', carbs: '54g', fat: '12g' },
    tags: ['warm', 'budget', 'quick'],
  },
];

export const filterOptions = ['quick', 'warm', 'light', 'budget', 'healthy', 'indulgent'] as const;

export function getRecommendations(moodId: MoodId, filters: string[] = []): Meal[] {
  let results = meals.filter(m => m.moodTags.includes(moodId));
  if (filters.length > 0) {
    results = results.filter(m => filters.some(f => m.tags.includes(f)));
  }
  if (results.length === 0) results = meals.slice(0, 3);
  return results;
}

export function getMealById(id: string): Meal | undefined {
  const local = meals.find(m => m.id === id);
  if (local) return local;
  // Check temp stored meals (from MealDB / AI)
  try {
    const stored = JSON.parse(localStorage.getItem('moodbite-temp-meals') || '{}');
    if (stored[id]) return stored[id] as Meal;
  } catch { /* ignore */ }
  return undefined;
}

export function mapTextToMood(text: string): MoodId {
  const lower = text.toLowerCase();
  if (/tired|exhaust|sleepy|drained/.test(lower)) return 'low-energy';
  if (/stress|overwhelm|anxious|too much/.test(lower)) return 'overwhelmed';
  if (/comfort|sad|lonely|down|hug/.test(lower)) return 'comforting';
  if (/focus|productive|sharp|clear/.test(lower)) return 'focused';
  if (/adventur|excit|curious|new|bold/.test(lower)) return 'adventurous';
  return 'light';
}

export const quotes = [
  "Sometimes choosing what to eat is really about choosing how to take care of yourself.",
  "Your body knows what it needs — you just have to pause and listen.",
  "Food is not just fuel. It's comfort, it's ritual, it's love.",
  "There's no wrong way to nourish yourself today.",
  "What you eat can be an act of kindness toward yourself.",
];
