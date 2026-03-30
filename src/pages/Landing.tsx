import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { quotes } from '@/lib/data';
import { useState, useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % quotes.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero */}
      <section className="container mx-auto px-6 pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block rounded-full border border-accent/30 px-4 py-1.5 text-xs font-semibold tracking-wider text-accent mb-8">
              FOOD × FEELINGS
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.05] text-foreground mb-6">
              What are you<br />craving{' '}
              <span className="font-display italic text-gradient">emotionally</span>?
            </h1>
            <p className="text-muted-foreground mb-2">
              maybe you're craving <strong className="text-foreground">energy</strong>
            </p>
            <p className="text-muted-foreground max-w-md mb-10 leading-relaxed">
              This isn't about macros, diets, or discipline. It's about noticing how
              you feel — and letting food respond to that.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/mood')}
                className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-elevated transition-shadow hover:shadow-card"
              >
                Explore by mood <ArrowRight size={16} />
              </motion.button>
              <span className="text-xs text-muted-foreground">no sign-ups · no judgment</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="rounded-3xl bg-card shadow-elevated p-10 max-w-sm animate-float">
                <p className="font-display text-base italic text-muted-foreground leading-relaxed text-center">
                  "{quotes[quoteIdx]}"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pause section */}
      <section className="text-center py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-semibold tracking-widest text-muted-foreground mb-3 block">PAUSE</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">There's no rush here.</h2>
        </motion.div>
      </section>
    </div>
  );
}
