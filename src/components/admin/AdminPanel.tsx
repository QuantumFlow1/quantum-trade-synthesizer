
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Agent } from "@/types/agent";
import AdminHeader from "@/components/admin/AdminHeader";
import SuperAdminMonitor from "@/components/admin/SuperAdminMonitor";
import AIAgentsList from "@/components/admin/AIAgentsList";
import StatisticsPanel from "@/components/admin/StatisticsPanel";
import QuickActions from "@/components/admin/QuickActions";
import SystemAlerts from "@/components/admin/SystemAlerts";
import UserDashboard from "@/components/UserDashboard";
import { useAgents } from "@/hooks/use-agents";

const AdminPanel = () => {
  const { toast } = useToast();
  const { signOut, userProfile } = useAuth();
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const { agents, handleAgentAction, handleAddAgent } = useAgents();

  const handleVerify = () => {
    toast({
      title: "Verificatie Uitgevoerd",
      description: "Alle transacties zijn geverifieerd",
    });
  };

  if (showUserDashboard) {
    return (
      <div>
        <div className="p-4 bg-background border-b">
          <Button 
            variant="outline" 
            onClick={() => setShowUserDashboard(false)}
            className="mb-4"
          >
            <Shield className="w-4 h-4 mr-2" />
            Terug naar Admin Paneel
          </Button>
        </div>
        <UserDashboard />
      </div>
    );
  }

  return (
    <div className="p-6">
      <AdminHeader 
        onDashboardClick={() => setShowUserDashboard(true)}
        onAddAgent={handleAddAgent}
        onSignOut={signOut}
      />

      <StatisticsPanel />

      {userProfile?.role === 'super_admin' && (
        <SuperAdminMonitor 
          userCount={1234}
          systemLoad={67}
          errorRate={0.5}
        />
      )}

      <AIAgentsList 
        agents={agents}
        onAction={handleAgentAction}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActions onVerify={handleVerify} />
        <SystemAlerts />
      </div>
    </div>
  );
};

export default AdminPanel;
