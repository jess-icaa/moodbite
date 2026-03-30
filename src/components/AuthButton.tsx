import { useAuth } from '@/hooks/useAuth';
import { signInWithGoogle, signOut } from '@/lib/supabase';
import { LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export function AuthButton() {
  const { user, isConfigured } = useAuth();

  if (!isConfigured) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {user.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt="avatar"
              className="w-7 h-7 rounded-full"
            />
          )}
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {user.email?.split('@')[0]}
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => signOut()}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut size={14} />
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => signInWithGoogle()}
      className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted transition-colors"
    >
      <LogIn size={14} /> Sign In
    </motion.button>
  );
}
