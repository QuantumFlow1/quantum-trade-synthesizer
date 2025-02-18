
import { Shield, Plus, LogOut, Users, Database, Activity, AlertTriangle, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import StatisticsPanel from "./admin/StatisticsPanel";
import AIAgentCard from "./admin/AIAgentCard";
import QuickActions from "./admin/QuickActions";
import SystemAlerts from "./admin/SystemAlerts";
import { useAuth } from "./auth/AuthProvider";
import UserDashboard from "./UserDashboard";

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
  const { signOut, userProfile } = useAuth();
  const [showUserDashboard, setShowUserDashboard] = useState(false);
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

  const [userCount, setUserCount] = useState(1234);
  const [systemLoad, setSystemLoad] = useState(67);
  const [errorRate, setErrorRate] = useState(0.5);

  // Als de gebruiker naar het dashboard kijkt, toon dat
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Admin Control Panel</h2>
        </div>
        <div className="flex gap-4">
          {userProfile?.role === 'super_admin' && (
            <Button 
              variant="outline" 
              onClick={() => setShowUserDashboard(true)}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Naar Dashboard
            </Button>
          )}
          <Button onClick={handleAddAgent}>
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Agent
          </Button>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Uitloggen
          </Button>
        </div>
      </div>

      <StatisticsPanel />

      {userProfile?.role === 'super_admin' && (
        <div className="mb-6 p-4 bg-secondary/10 rounded-lg border border-secondary">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Super Admin Monitor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                <span className="font-medium">Actieve Gebruikers</span>
              </div>
              <div className="text-2xl font-bold">{userCount}</div>
            </div>
            <div className="p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4" />
                <span className="font-medium">Systeem Belasting</span>
              </div>
              <div className="text-2xl font-bold">{systemLoad}%</div>
            </div>
            <div className="p-4 rounded-lg bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Error Rate</span>
              </div>
              <div className="text-2xl font-bold">{errorRate}%</div>
            </div>
          </div>
        </div>
      )}

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
