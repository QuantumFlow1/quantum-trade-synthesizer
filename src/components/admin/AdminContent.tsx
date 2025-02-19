
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import SuperAdminMonitor from "@/components/admin/SuperAdminMonitor";
import AIAgentsList from "@/components/admin/AIAgentsList";
import StatisticsPanel from "@/components/admin/StatisticsPanel";
import QuickActions from "@/components/admin/QuickActions";
import SystemAlerts from "@/components/admin/SystemAlerts";
import { useAgents } from "@/hooks/use-agents";

interface AdminContentProps {
  onDashboardClick: () => void;
}

const AdminContent = ({ onDashboardClick }: AdminContentProps) => {
  const { toast } = useToast();
  const { signOut, userProfile } = useAuth();
  const { agents, handleAgentAction, handleAddAgent } = useAgents();

  const handleVerify = () => {
    toast({
      title: "Verificatie Uitgevoerd",
      description: "Alle transacties zijn geverifieerd",
    });
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <AdminHeader 
          onDashboardClick={onDashboardClick}
          onAddAgent={handleAddAgent}
          onSignOut={signOut}
        />

        <div className="space-y-4 sm:space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <QuickActions onVerify={handleVerify} />
            <SystemAlerts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
