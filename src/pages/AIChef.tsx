import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ChefHat, Clock, Flame, Heart } from 'lucide-react';
import { chatWithAIChef, isGeminiConfigured } from '@/lib/gemini';
import { Meal } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { store } from '@/lib/store';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  meal?: Meal;
}

export default function AIChef() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hey there! I'm your AI Chef 👨‍🍳 Tell me how you're feeling, what ingredients you have, or what you're craving — and I'll create the perfect recipe just for you." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const configured = isGeminiConfigured();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const response = await chatWithAIChef(userMsg, history);

    setMessages(prev => [...prev, {
      role: 'model',
      text: response.reply,
      meal: response.meal || undefined,
    }]);
    setLoading(false);
  };

  const saveMeal = (meal: Meal) => {
    store.toggleFavorite(meal.id);
  };

  if (!configured) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <span className="text-6xl mb-6 block">🔑</span>
          <h1 className="font-display text-3xl font-black text-foreground mb-4">AI Chef needs a key</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            To use AI-powered recipe generation, add your free Gemini API key in your Profile settings.
            Get one free at{' '}
            <a href="https://aistudio.google.com" target="_blank" rel="noopener" className="text-accent underline">
              aistudio.google.com
            </a>
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            Go to Settings
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <div className="container mx-auto px-6 pt-8 pb-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <ChefHat size={20} className="text-accent" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-black text-foreground">AI Chef</h1>
              <p className="text-xs text-muted-foreground">Powered by Gemini</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="container mx-auto max-w-2xl space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-3xl px-5 py-3.5 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-lg'
                    : 'bg-card shadow-soft text-foreground rounded-bl-lg'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>

                  {/* Rendered Meal Card */}
                  {msg.meal && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 rounded-2xl bg-secondary/50 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-base font-bold text-foreground">{msg.meal.name}</h4>
                        <span className="inline-flex items-center gap-1 text-xs text-accent">
                          <Sparkles size={12} /> AI Generated
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground italic">{msg.meal.moodReason}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock size={12} /> {msg.meal.prepTime}</span>
                        <span className="flex items-center gap-1"><Heart size={12} /> {msg.meal.comfortScore}%</span>
                        <span className="flex items-center gap-1"><Flame size={12} /> {msg.meal.energyScore}%</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-1">Ingredients:</p>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {msg.meal.ingredients.slice(0, 6).map((ing, j) => (
                            <li key={j} className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-accent/60" />
                              {ing}
                            </li>
                          ))}
                          {msg.meal.ingredients.length > 6 && (
                            <li className="text-accent text-xs">+{msg.meal.ingredients.length - 6} more</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-1">Steps:</p>
                        <ol className="text-xs text-muted-foreground space-y-0.5 list-decimal list-inside">
                          {msg.meal.instructions.map((step, j) => (
                            <li key={j}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      <button
                        onClick={() => saveMeal(msg.meal!)}
                        className="rounded-full bg-accent/10 text-accent px-4 py-1.5 text-xs font-medium hover:bg-accent/20 transition-colors"
                      >
                        ♥ Save Recipe
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-card shadow-soft rounded-3xl rounded-bl-lg px-5 py-3.5">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Sparkles size={14} className="animate-spin-slow text-accent" />
                  Cooking up something special...
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="border-t border-border/50 glass p-4">
        <div className="container mx-auto max-w-2xl flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="I have chicken, rice, and I'm feeling tired..."
            className="flex-1 rounded-full bg-card shadow-soft pl-5 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="rounded-full bg-primary w-12 h-12 flex items-center justify-center text-primary-foreground shadow-soft disabled:opacity-50"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
