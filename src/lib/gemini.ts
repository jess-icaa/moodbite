import { GoogleGenerativeAI } from '@google/generative-ai';
import { Meal, MoodId, UserPreferences } from './types';

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiKey(): string {
  return localStorage.getItem('moodbite-gemini-key') || '';
}

export function setGeminiKey(key: string) {
  localStorage.setItem('moodbite-gemini-key', key);
  genAI = key ? new GoogleGenerativeAI(key) : null;
}

export function isGeminiConfigured(): boolean {
  return !!getGeminiKey();
}

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const key = getGeminiKey();
    if (!key) throw new Error('Gemini API key not configured');
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

// Words that disqualify a model from being a text chat model
const EXCLUDE_KEYWORDS = ['image', 'vision', 'embedding', 'embed', 'retrieval', 'aqa', 'nano'];
// Words we prefer to see in a model name
const PREFER_KEYWORDS = ['flash', 'pro'];

let cachedModelName = '';
async function getBestModel(): Promise<string> {
  if (cachedModelName) return cachedModelName;
  const key = getGeminiKey();

  // 1. Fetch all models available to this key
  let candidates: string[] = [];
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await res.json();
    const allModels: { name: string; supportedGenerationMethods?: string[] }[] = data.models || [];

    candidates = allModels
      .filter(m =>
        m.supportedGenerationMethods?.includes('generateContent') &&
        !EXCLUDE_KEYWORDS.some(kw => m.name.toLowerCase().includes(kw))
      )
      .map(m => m.name.replace('models/', ''))
      // Sort: prefer flash/pro, prefer non-preview, prefer shorter (stable) names
      .sort((a, b) => {
        const scoreA =
          (PREFER_KEYWORDS.some(k => a.includes(k)) ? 10 : 0) -
          (a.includes('preview') ? 5 : 0) -
          (a.includes('lite') ? 2 : 0);
        const scoreB =
          (PREFER_KEYWORDS.some(k => b.includes(k)) ? 10 : 0) -
          (b.includes('preview') ? 5 : 0) -
          (b.includes('lite') ? 2 : 0);
        return scoreB - scoreA;
      });
  } catch {
    candidates = ['gemini-2.0-flash', 'gemini-1.5-pro-latest', 'gemini-1.5-flash-latest'];
  }

  // 2. Try each candidate with a real tiny call until one works
  const client = getClient();
  for (const modelName of candidates) {
    try {
      const testModel = client.getGenerativeModel({ model: modelName });
      await testModel.generateContent('hi');
      cachedModelName = modelName;
      console.log('MoodBite: selected Gemini model →', modelName);
      return modelName;
    } catch (e: any) {
      // 503 = overloaded but exists → keep trying; 429 = quota → stop; anything else → try next
      if (e?.message?.includes('429')) break;
      continue;
    }
  }

  // 3. Absolute last resort
  cachedModelName = candidates[0] || 'gemini-2.0-flash';
  return cachedModelName;
}


export async function analyzeMoodText(text: string): Promise<{ mood: MoodId; insight: string }> {
  try {
    const client = getClient();
    const modelName = await getBestModel();
    const model = client.getGenerativeModel({ model: modelName });

    const prompt = `You are a mood analysis expert for a food recommendation app called MoodBite.
Analyze the following text and determine which mood category best fits.

Available mood categories:
- "light" — feeling light, happy, open, cheerful
- "comforting" — needing comfort, feeling sad, lonely, down
- "low-energy" — tired, exhausted, sleepy, drained
- "overwhelmed" — stressed, anxious, too much going on
- "focused" — productive, sharp, clear-headed, motivated
- "adventurous" — curious, excited, wanting something new and bold

User's text: "${text}"

Respond in ONLY valid JSON (no markdown, no code fences):
{"mood": "<mood_id>", "insight": "<1 sentence empathetic insight about how they feel>"}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn('Gemini mood analysis failed, using fallback:', e);
    return { mood: 'light', insight: 'Let me suggest something nice for you.' };
  }
}

export async function generateMeals(
  mood: MoodId,
  preferences: UserPreferences,
  count: number = 3,
  extraContext?: string
): Promise<Meal[]> {
  try {
    const client = getClient();
    const modelName = await getBestModel();
    const model = client.getGenerativeModel({ model: modelName });

    const dietaryInfo = preferences.dietary.length > 0 ? `Dietary: ${preferences.dietary.join(', ')}. ` : '';
    const allergyInfo = preferences.allergies.length > 0 ? `Avoid allergens: ${preferences.allergies.join(', ')}. ` : '';
    const cuisineInfo = preferences.cuisines.length > 0 ? `Preferred cuisines: ${preferences.cuisines.join(', ')}. ` : '';
    const goalInfo = preferences.goals.length > 0 ? `Goals: ${preferences.goals.join(', ')}. ` : '';

    const prompt = `You are a creative chef AI for MoodBite, a mood-based food recommendation app.

Generate ${count} unique, delicious meal recipes for someone feeling "${mood}".
${dietaryInfo}${allergyInfo}${cuisineInfo}${goalInfo}
${extraContext ? `Additional context: ${extraContext}` : ''}

Each meal must have an emotionally thoughtful "moodReason" explaining why this meal suits their current emotional state.

Respond in ONLY valid JSON (no markdown, no code fences) as an array:
[{
  "id": "<kebab-case-unique-id>",
  "name": "<meal name>",
  "image": "",
  "moodReason": "<2 sentences: why this meal matches the mood emotionally>",
  "moodTags": ["${mood}"],
  "prepTime": "<X min>",
  "comfortScore": <0-100>,
  "energyScore": <0-100>,
  "ingredients": ["<ingredient> — <amount>", ...],
  "instructions": ["<step 1>", "<step 2>", ...],
  "nutrition": {"calories": <number>, "protein": "<Xg>", "carbs": "<Xg>", "fat": "<Xg>"},
  "tags": ["<2-3 tags from: quick, warm, light, budget, healthy, indulgent>"]
}]`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const meals: Meal[] = JSON.parse(cleaned);

    return meals.map(m => ({
      ...m,
      isAIGenerated: true,
      sourceApi: 'gemini' as const,
    }));
  } catch (e) {
    console.warn('Gemini meal generation failed:', e);
    return [];
  }
}

export async function chatWithAIChef(
  message: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<{ reply: string; meal?: Meal }> {
  try {
    const client = getClient();
    const modelName = await getBestModel();
    const model = client.getGenerativeModel({ model: modelName });

    const chatHistory = history.map(h => `${h.role === 'user' ? 'User' : 'Chef'}: ${h.text}`).join('\n');

    const prompt = `You are a warm, friendly AI Chef for MoodBite — a mood-based food recommendation app.
You help users discover the perfect meal based on how they're feeling, what ingredients they have, and their preferences.

Be conversational, empathetic, and brief (2-3 sentences max per reply).
When you have enough info to suggest a meal, include the full recipe JSON.

Previous conversation:
${chatHistory}

User: ${message}

Respond in ONLY valid JSON (no markdown, no code fences):
{
  "reply": "<your conversational response>",
  "meal": null
}

If you HAVE enough info to suggest a meal, replace the null with the meal object:
{
  "reply": "<your conversational response>",
  "meal": {
    "id": "<kebab-case-id>",
    "name": "<name>",
    "image": "",
    "moodReason": "<why this suits them>",
    "moodTags": ["<mood>"],
    "prepTime": "<X min>",
    "comfortScore": <0-100>,
    "energyScore": <0-100>,
    "ingredients": ["<ingredient> — <amount>"],
    "instructions": ["<step>"],
    "nutrition": {"calories": <n>, "protein": "<Xg>", "carbs": "<Xg>", "fat": "<Xg>"},
    "tags": ["<tags>"]
  }
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (parsed.meal) {
      parsed.meal.isAIGenerated = true;
      parsed.meal.sourceApi = 'gemini';
    }

    return parsed;
  } catch (e: any) {
    console.warn('AI Chef chat failed:', e);
    return { reply: `I'm having trouble thinking right now. Error details: ${e?.message || String(e)}` };
  }
}
