
import { Shield, Plus, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onDashboardClick: () => void;
  onAddAgent: () => void;
  onSignOut: () => void;
}

const AdminHeader = ({ onDashboardClick, onAddAgent, onSignOut }: AdminHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Admin Control Panel</h2>
      </div>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={onDashboardClick}
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Naar Dashboard
        </Button>
        <Button onClick={onAddAgent}>
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Agent
        </Button>
        <Button variant="outline" onClick={onSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Uitloggen
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
