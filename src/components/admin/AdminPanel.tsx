
import { useState } from "react";
import AdminContent from "@/components/admin/AdminContent";
import DashboardView from "@/components/admin/DashboardView";
import { useAuth } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";

const AdminPanel = () => {
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const { userProfile } = useAuth();

  // Redirect naar home als gebruiker geen admin rechten heeft
  if (!userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'super_admin')) {
    return <Navigate to="/" replace />;
  }

  if (showUserDashboard) {
    return <DashboardView onBack={() => setShowUserDashboard(false)} />;
  }

  return <AdminContent onDashboardClick={() => setShowUserDashboard(true)} />;
};

export default AdminPanel;
