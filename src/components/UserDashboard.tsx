
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { addOnboardingAttributes } from '@/utils/onboarding-helpers';

const UserDashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set onboarding element IDs
    addOnboardingAttributes();
  }, [location.pathname]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route path="/*" element={<DashboardContent />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default UserDashboard;
