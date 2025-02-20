
import { useState } from "react";
import AdminPanelHeader from "@/components/admin/AdminPanelHeader";
import AdminPanelContent from "@/components/admin/AdminPanelContent";
import { Agent } from "@/types/agent";

const AdminPanel = () => {
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showAccountManagement, setShowAccountManagement] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

  const handleDashboardClick = () => {
    setShowUserDashboard(true);
    setShowAccountManagement(false);
  };

  const handleAccountManagement = () => {
    setShowAccountManagement(true);
    setShowUserDashboard(false);
  };

  const handleAddAgent = () => {
    console.log("Add agent clicked");
  };

  const handleSignOut = () => {
    console.log("Sign out clicked");
  };

  return (
    <div className="space-y-6">
      <AdminPanelHeader
        onDashboardClick={handleDashboardClick}
        onAccountManagement={handleAccountManagement}
        onAddAgent={handleAddAgent}
        onSignOut={handleSignOut}
        setShowUserDashboard={setShowUserDashboard}
        setShowAccountManagement={setShowAccountManagement}
        setAgents={setAgents}
      />
      <AdminPanelContent
        userRole="admin"
        agents={agents}
        setAgents={setAgents}
        userCount={100}
        systemLoad={65}
        errorRate={2.5}
      />
    </div>
  );
};

export default AdminPanel;
