export type MoodId = 'light' | 'comforting' | 'low-energy' | 'overwhelmed' | 'focused' | 'adventurous';

export interface Mood {
  id: MoodId;
  emoji: string;
  label: string;
  description: string;
  color: string;
}

export interface Meal {
  id: string;
  name: string;
  image: string;
  moodReason: string;
  moodTags: MoodId[];
  prepTime: string;
  comfortScore: number;
  energyScore: number;
  ingredients: string[];
  instructions: string[];
  nutrition: { calories: number; protein: string; carbs: string; fat: string };
  tags: string[];
  swapSuggestions?: string[];
  isAIGenerated?: boolean;
  sourceApi?: 'local' | 'gemini' | 'mealdb';
}

export interface UserPreferences {
  dietary: string[];
  allergies: string[];
  cuisines: string[];
  avoidFoods: string[];
  goals: string[];
}

export interface FeedbackEntry {
  mealId: string;
  type: 'helped' | 'not-for-me' | 'warmer' | 'lighter' | 'quicker';
  timestamp: number;
}

export interface MoodEntry {
  mood: MoodId;
  text?: string;
  timestamp: number;
  recommendations: string[];
  mealChosen?: string;
}

export interface AISettings {
  geminiApiKey: string;
  preferAI: boolean;
}

export interface ShoppingItem {
  ingredient: string;
  fromMeal: string;
  checked: boolean;
}
