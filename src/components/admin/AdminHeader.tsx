
import { Shield, Plus, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onDashboardClick: () => void;
  onAddAgent: () => void;
  onSignOut: () => void;
}

const AdminHeader = ({ onDashboardClick, onAddAgent, onSignOut }: AdminHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Admin Control Panel</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={onDashboardClick}
          size="sm"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <Button 
          onClick={onAddAgent}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Agent
        </Button>
        <Button 
          variant="outline" 
          onClick={onSignOut}
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Uitloggen
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
