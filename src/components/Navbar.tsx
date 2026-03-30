import { Link, useLocation } from 'react-router-dom';
import { Heart, User, Home, BarChart3, Globe, ChefHat } from 'lucide-react';
import { AuthButton } from '@/components/AuthButton';
import { isGeminiConfigured } from '@/lib/gemini';

export function Navbar() {
  const { pathname } = useLocation();

  const link = (to: string, label: string, Icon: typeof Home) => (
    <Link
      to={to}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors
        ${pathname === to ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
    >
      <Icon size={16} /> <span className="hidden sm:inline">{label}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-bold text-foreground">
          <span className="text-accent">Mood</span>Bite
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          {link('/', 'Home', Home)}
          {link('/explore', 'Explore', Globe)}
          {isGeminiConfigured() && link('/ai-chef', 'AI Chef', ChefHat)}
          {link('/analytics', 'Analytics', BarChart3)}
          {link('/favorites', 'Saved', Heart)}
          {link('/profile', 'Settings', User)}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
