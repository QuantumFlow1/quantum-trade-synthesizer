
import { Agent } from "@/types/agent";
import SuperAdminMonitor from "./SuperAdminMonitor";
import AIAgentsList from "./AIAgentsList";
import StatisticsPanel from "./StatisticsPanel";
import QuickActions from "./QuickActions";
import SystemAlerts from "./SystemAlerts";
import { useToast } from "@/hooks/use-toast";

interface AdminPanelContentProps {
  userRole?: string;
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  userCount: number;
  systemLoad: number;
  errorRate: number;
}

const AdminPanelContent = ({
  userRole,
  agents,
  setAgents,
  userCount,
  systemLoad,
  errorRate
}: AdminPanelContentProps) => {
  const { toast } = useToast();

  const handleVerify = () => {
    toast({
      title: "Verificatie Uitgevoerd",
      description: "Alle transacties zijn geverifieerd",
    });
  };

  const handleAgentAction = (agentId: string, action: "terminate" | "activate" | "pause") => {
    setAgents(currentAgents => 
      currentAgents.map(agent => {
        if (agent.id === agentId) {
          const newStatus = action === "terminate" ? "terminated" : 
                          action === "activate" ? "active" : "paused";
          return { ...agent, status: newStatus };
        }
        return agent;
      })
    );

    toast({
      title: `Agent ${action === "terminate" ? "Beëindigd" : action === "activate" ? "Geactiveerd" : "Gepauzeerd"}`,
      description: `Agent status succesvol bijgewerkt`,
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <StatisticsPanel />

      {userRole === 'super_admin' && (
        <SuperAdminMonitor 
          userCount={userCount}
          systemLoad={systemLoad}
          errorRate={errorRate}
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
  );
};

export default AdminPanelContent;
