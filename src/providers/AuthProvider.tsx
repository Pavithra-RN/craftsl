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
      if (sessionStorage.getItem('craftsl-logged-out') === 'true') {
        setLoading(false)
        return
      }
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem('craftsl-auth', JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          user: session.user
        }));
        try {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } catch (err) {
          console.error('fetchProfile failed:', err);
        }
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
        if (sessionStorage.getItem('craftsl-logged-out') === 'true' && 
            event === 'SIGNED_IN') {
          return
        }
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
            localStorage.setItem('craftsl-auth', JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              user: session.user
            }));
            try {
              const profileData = await fetchProfile(session.user.id);
              setProfile(profileData);
            } catch (err) {
              console.error('fetchProfile failed:', err);
            }
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
      // Check if user manually logged out
      const loggedOut = sessionStorage.getItem('craftsl-logged-out')
      if (loggedOut) return
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session && user) {
        setUser(null)
        setProfile(null)
        localStorage.removeItem('craftsl-auth')
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [user])

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
