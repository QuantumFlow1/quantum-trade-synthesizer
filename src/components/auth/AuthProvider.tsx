
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export type UserRole = 'trader' | 'admin' | 'super_admin' | 'viewer' | 'analyst' | 'lov_trader';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  status: UserStatus;
  last_login?: Date;
  created_at?: Date;
  subscription_tier?: SubscriptionTier;
  api_access?: boolean;
  trading_enabled?: boolean;
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  isLovTrader: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  isLovTrader: false,
  signIn: async () => {},
  signOut: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const isLovTrader = userProfile?.role === 'lov_trader';

  useEffect(() => {
    // Mock user for development purposes
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User',
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    const mockProfile: UserProfile = {
      id: '123',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'trader',
      status: 'active',
      last_login: new Date(),
      created_at: new Date(),
      subscription_tier: 'pro',
      api_access: true,
      trading_enabled: true,
    };

    setUser(mockUser);
    setUserProfile(mockProfile);
    setLoading(false);

    // In a real implementation, we would fetch the user from Supabase
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   setUser(session?.user ?? null);
    //   setLoading(false);
    // });

    // const { data: authListener } = supabase.auth.onAuthStateChange(
    //   async (event, session) => {
    //     setUser(session?.user ?? null);
    //     setLoading(false);
    //   }
    // );

    // return () => {
    //   authListener.subscription.unsubscribe();
    // };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setError(error as Error);
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setError(error as Error);
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, error, isLovTrader, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
