
import { useState } from "react";
import AdminPanelHeader from "@/components/admin/AdminPanelHeader";
import AdminPanelContent from "@/components/admin/AdminPanelContent";
import UserDashboard from "@/components/UserDashboard";
import { SuperAdminVoiceAssistant } from "@/components/admin/SuperAdminVoiceAssistant";
import { Agent } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const AdminPanel = () => {
  const { userProfile } = useAuth();
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

  const handleBackToAdmin = () => {
    setShowUserDashboard(false);
    setShowAccountManagement(false);
  };

  if (showUserDashboard) {
    return (
      <div>
        <Button
          variant="outline"
          onClick={handleBackToAdmin}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug naar Admin
        </Button>
        <UserDashboard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showAccountManagement && (
        <Button
          variant="outline"
          onClick={handleBackToAdmin}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug naar Admin
        </Button>
      )}
      <AdminPanelHeader
        onDashboardClick={handleDashboardClick}
        onAccountManagement={handleAccountManagement}
        onAddAgent={handleAddAgent}
        onSignOut={handleSignOut}
        setShowUserDashboard={setShowUserDashboard}
        setShowAccountManagement={setShowAccountManagement}
        setAgents={setAgents}
      />
      {userProfile?.role === 'super_admin' && <SuperAdminVoiceAssistant />}
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
