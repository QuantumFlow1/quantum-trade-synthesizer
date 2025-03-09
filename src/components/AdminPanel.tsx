
import { useState } from "react";
import AdminPanelHeader from "@/components/admin/AdminPanelHeader";
import AdminPanelContent from "@/components/admin/AdminPanelContent";
import UserDashboard from "@/components/UserDashboard";
// Remove the SuperAdminVoiceAssistant import
import { Agent } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const AdminPanel = () => {
  const { userProfile, signOut } = useAuth();
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showAccountManagement, setShowAccountManagement] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

  // Force disable any chat functionality
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('disable-chat-services', 'true');
  }

  const handleDashboardClick = () => {
    // Set flag in localStorage to indicate we're coming from admin page
    localStorage.setItem('fromAdminPage', 'true');
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

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
      {/* Remove the SuperAdminVoiceAssistant component */}
      {/* Note: commented out userProfile?.role === 'super_admin' && <SuperAdminVoiceAssistant /> */}
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
