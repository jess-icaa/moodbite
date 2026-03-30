import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { onAuthStateChange, getUser, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isConfigured: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Get initial user
    getUser().then(u => {
      setUser(u);
      setLoading(false);
    });

    // Listen for changes
    const { data } = onAuthStateChange((u) => {
      setUser(u);
      setLoading(false);
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, [isConfigured]);

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
