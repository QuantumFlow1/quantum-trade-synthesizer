
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import AdminHeader from "./AdminHeader";
import { Agent } from "@/types/agent";

interface AdminPanelHeaderProps {
  onDashboardClick: () => void;
  onAccountManagement: () => void;
  onAddAgent: () => void;
  onSignOut: () => void;
  setShowUserDashboard: (show: boolean) => void;
  setShowAccountManagement: (show: boolean) => void;
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
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
    <div className="w-full px-4 sm:px-0">
      <AdminHeader
        onDashboardClick={onDashboardClick}
        onAccountManagement={onAccountManagement}
        onAddAgent={onAddAgent}
        onSignOut={onSignOut}
      />
    </div>
  );
};

export default AdminPanelHeader;
