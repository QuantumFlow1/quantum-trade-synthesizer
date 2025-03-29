
// Import necessary packages
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '@/types/auth';

// Define the UserProfile type
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  last_login?: Date;
  status: string;
  created_at: Date;
  trading_enabled: boolean;
  subscription_tier?: string;
}

// Define the Auth Context type
export interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to authenticate
      // Mock user authentication
      const mockUser = { uid: '123', email };
      const mockProfile: UserProfile = {
        id: '123',
        email,
        first_name: 'Test',
        last_name: 'User',
        role: 'user',
        status: 'active',
        created_at: new Date(),
        trading_enabled: true,
        subscription_tier: 'premium'
      };
      
      setUser(mockUser);
      setUserProfile(mockProfile);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Mock sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to sign out
      setUser(null);
      setUserProfile(null);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Mock user authentication effect
  useEffect(() => {
    // In a real app, this would check if the user is already authenticated
    const checkAuth = async () => {
      try {
        // Mock auto-authentication for demonstration
        const mockUser = { uid: '123', email: 'user@example.com' };
        const mockProfile: UserProfile = {
          id: '123',
          email: 'user@example.com',
          first_name: 'Test',
          last_name: 'User',
          role: 'user',
          status: 'active',
          created_at: new Date(),
          trading_enabled: true,
          subscription_tier: 'premium'
        };
        
        setUser(mockUser);
        setUserProfile(mockProfile);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
