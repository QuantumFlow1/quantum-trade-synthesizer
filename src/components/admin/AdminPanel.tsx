
import { useState } from "react";
import AdminContent from "@/components/admin/AdminContent";
import DashboardView from "@/components/admin/DashboardView";

const AdminPanel = () => {
  const [showUserDashboard, setShowUserDashboard] = useState(false);

  if (showUserDashboard) {
    return <DashboardView onBack={() => setShowUserDashboard(false)} />;
  }

  return <AdminContent onDashboardClick={() => setShowUserDashboard(true)} />;
};

export default AdminPanel;
