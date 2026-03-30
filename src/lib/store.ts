import { UserPreferences, MoodEntry, FeedbackEntry } from './types';

const KEYS = {
  favorites: 'moodbite-favorites',
  history: 'moodbite-history',
  preferences: 'moodbite-preferences',
  feedback: 'moodbite-feedback',
};

function get<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  getFavorites: (): string[] => get(KEYS.favorites, []),
  toggleFavorite: (id: string) => {
    const favs = store.getFavorites();
    const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    set(KEYS.favorites, next);
    return next;
  },
  isFavorite: (id: string) => store.getFavorites().includes(id),

  getHistory: (): MoodEntry[] => get(KEYS.history, []),
  addHistory: (entry: MoodEntry) => {
    const h = store.getHistory();
    set(KEYS.history, [entry, ...h].slice(0, 50));
  },

  getPreferences: (): UserPreferences => get(KEYS.preferences, {
    dietary: [], allergies: [], cuisines: [], avoidFoods: [], goals: [],
  }),
  setPreferences: (p: UserPreferences) => set(KEYS.preferences, p),

  getFeedback: (): FeedbackEntry[] => get(KEYS.feedback, []),
  addFeedback: (entry: FeedbackEntry) => {
    const f = store.getFeedback();
    set(KEYS.feedback, [entry, ...f].slice(0, 100));
  },
};
