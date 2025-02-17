
import { Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import StatisticsPanel from "./admin/StatisticsPanel";
import AIAgentCard from "./admin/AIAgentCard";
import QuickActions from "./admin/QuickActions";
import SystemAlerts from "./admin/SystemAlerts";

interface Agent {
  id: string;
  name: string;
  status: "active" | "paused" | "terminated";
  type: "trading" | "analysis" | "risk";
  performance: string;
  lastActive: string;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Trading Bot Alpha",
      status: "active",
      type: "trading",
      performance: "+15.4%",
      lastActive: "Nu"
    },
    {
      id: "2",
      name: "Market Analyzer Beta",
      status: "paused",
      type: "analysis",
      performance: "98% accuracy",
      lastActive: "5 min geleden"
    },
    {
      id: "3",
      name: "Risk Manager Gamma",
      status: "active",
      type: "risk",
      performance: "Low risk",
      lastActive: "Nu"
    }
  ]);

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

  const handleAddAgent = () => {
    const newAgent: Agent = {
      id: `${agents.length + 1}`,
      name: "Nieuwe AI Agent",
      status: "paused",
      type: "analysis",
      performance: "N/A",
      lastActive: "Nooit"
    };

    setAgents(current => [...current, newAgent]);
    
    toast({
      title: "Nieuwe Agent Toegevoegd",
      description: "AI Agent is klaar voor configuratie",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Admin Control Panel</h2>
        </div>
        <Button onClick={handleAddAgent}>
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Agent
        </Button>
      </div>

      <StatisticsPanel />

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">AI Agent Management</h3>
        <div className="space-y-4">
          {agents.filter(agent => agent.status !== "terminated").map((agent) => (
            <AIAgentCard 
              key={agent.id} 
              agent={agent} 
              onAction={handleAgentAction}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActions onVerify={handleVerify} />
        <SystemAlerts />
      </div>
    </div>
  );
};

export default AdminPanel;
