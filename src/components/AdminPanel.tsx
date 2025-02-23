
import { useState } from "react";
import AdminPanelHeader from "@/components/admin/AdminPanelHeader";
import AdminPanelContent from "@/components/admin/AdminPanelContent";
import UserDashboard from "@/components/UserDashboard";
import { AutomatedTradingPanel } from "@/components/trading/AutomatedTradingPanel";
import { Agent } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AdminPanel = () => {
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showAccountManagement, setShowAccountManagement] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

  const handleDashboardClick = () => {
    setShowUserDashboard(true);
    setShowAccountManagement(false);
    setShowSimulator(false);
  };

  const handleAccountManagement = () => {
    setShowAccountManagement(true);
    setShowUserDashboard(false);
    setShowSimulator(false);
  };

  const handleSimulatorClick = () => {
    setShowSimulator(true);
    setShowUserDashboard(false);
    setShowAccountManagement(false);
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
    setShowSimulator(false);
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

  if (showSimulator) {
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
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold">Trading Simulator</h2>
          <AutomatedTradingPanel simulationMode={true} />
        </div>
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
        onSimulatorClick={handleSimulatorClick}
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
