
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our authentication context
type User = {
  id: string;
  email: string;
} | null;

type UserProfile = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  last_login?: Date | null;
} | null;

interface AuthContextType {
  user: User;
  userProfile: UserProfile;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component for the authentication context
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication for demonstration purposes
  useEffect(() => {
    // Simulate loading auth state
    setTimeout(() => {
      const mockUser = {
        id: '1',
        email: 'user@example.com'
      };
      
      const mockProfile = {
        id: '1',
        email: 'user@example.com',
        first_name: 'Demo',
        last_name: 'User',
        role: 'user',
        last_login: new Date()
      };
      
      setUser(mockUser);
      setUserProfile(mockProfile);
      setLoading(false);
    }, 500);
  }, []);

  // Mock authentication functions
  const login = async (email: string, password: string) => {
    // Mock implementation
    setUser({ id: '1', email });
    setUserProfile({
      id: '1',
      email,
      first_name: 'Demo',
      last_name: 'User',
      role: 'user',
      last_login: new Date()
    });
  };

  const logout = async () => {
    // Mock implementation
    setUser(null);
    setUserProfile(null);
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    // Mock implementation
    setUser({ id: '1', email });
    setUserProfile({
      id: '1',
      email,
      first_name: firstName,
      last_name: lastName,
      role: 'user',
      last_login: null
    });
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for using the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
