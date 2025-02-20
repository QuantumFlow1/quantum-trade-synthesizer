
import { Button } from "@/components/ui/button";
import { Agent } from "@/types/agent";

interface AdminPanelHeaderProps {
  onDashboardClick: () => void;
  onAccountManagement: () => void;
  onAddAgent: () => void;
  onSignOut: () => void;
  setShowUserDashboard: (show: boolean) => void;
  setShowAccountManagement: (show: boolean) => void;
  setAgents: (agents: Agent[]) => void;
}

const AdminPanelHeader = ({
  onDashboardClick,
  onAccountManagement,
  onAddAgent,
  onSignOut,
  setShowUserDashboard,
  setShowAccountManagement,
  setAgents
}: AdminPanelHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-x-2">
        <Button onClick={onDashboardClick}>Dashboard</Button>
        <Button onClick={onAccountManagement}>Account Beheer</Button>
        <Button onClick={onAddAgent}>Nieuwe AI Agent</Button>
      </div>
      <Button variant="destructive" onClick={onSignOut}>Uitloggen</Button>
    </div>
  );
};

export default AdminPanelHeader;
