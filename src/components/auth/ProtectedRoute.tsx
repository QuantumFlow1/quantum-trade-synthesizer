
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, userProfile } = useAuth();

  // If there's no user, redirect to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Return the children (the protected content)
  return <>{children}</>;
};
