import { Shield, Search, AlertTriangle, Users, Plus, X, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="font-medium mb-1">Actieve Users</div>
          <div className="text-2xl font-bold">1,234</div>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="font-medium mb-1">Open Orders</div>
          <div className="text-2xl font-bold">567</div>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="font-medium mb-1">Dagelijks Volume</div>
          <div className="text-2xl font-bold">$2.5M</div>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="font-medium mb-1">Systeem Status</div>
          <div className="text-2xl font-bold text-green-400">Normaal</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">AI Agent Management</h3>
        <div className="space-y-4">
          {agents.filter(agent => agent.status !== "terminated").map((agent) => (
            <div key={agent.id} className="p-4 rounded-lg bg-secondary/50 flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">{agent.name}</div>
                <div className="text-sm text-muted-foreground">
                  Type: {agent.type} • Performance: {agent.performance} • Laatst actief: {agent.lastActive}
                </div>
                <div className={`text-sm ${
                  agent.status === "active" ? "text-green-400" : 
                  agent.status === "paused" ? "text-yellow-400" : 
                  "text-red-400"
                }`}>
                  Status: {agent.status}
                </div>
              </div>
              <div className="flex gap-2">
                {agent.status === "paused" ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAgentAction(agent.id, "activate")}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Activeer
                  </Button>
                ) : agent.status === "active" ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAgentAction(agent.id, "pause")}
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Pauzeer
                  </Button>
                ) : null}
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleAgentAction(agent.id, "terminate")}
                >
                  <X className="w-4 h-4 mr-1" />
                  Beëindig
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-2">Snelle Acties</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleVerify}>
              <Search className="w-4 h-4 mr-2" />
              Verifieer Trades
            </Button>
            <Button variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Risk Check
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Systeem Alerts</h3>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400 text-sm">
              Hoge trading volume op BTC/USD
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 text-green-400 text-sm">
              Alle systemen operationeel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
