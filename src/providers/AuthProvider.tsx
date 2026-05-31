'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('craftsl-auth');
      setUser(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
        localStorage.setItem('craftsl-auth', JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          user: session.user
        }));
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    // Listen for ALL auth state changes including 
    // TOKEN_REFRESHED, SIGNED_OUT, USER_UPDATED
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_OUT' || 
            (event as string) === 'USER_DELETED' || 
            !session) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          localStorage.removeItem('craftsl-auth');
          return;
        }

        if (event === 'SIGNED_IN' || 
            event === 'TOKEN_REFRESHED' ||
            event === 'USER_UPDATED') {
          if (session?.user) {
            setUser(session.user);
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            localStorage.setItem('craftsl-auth', JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              user: session.user
            }));
          }
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && user) {
        // Session is gone but state still has user — clear it
        setUser(null);
        setProfile(null);
      }
    }, 60000); // check every 60 seconds
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
