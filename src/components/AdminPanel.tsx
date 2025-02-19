
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Agent } from "@/types/agent";
import AdminHeader from "./admin/AdminHeader";
import SuperAdminMonitor from "./admin/SuperAdminMonitor";
import AIAgentsList from "./admin/AIAgentsList";
import StatisticsPanel from "./admin/StatisticsPanel";
import QuickActions from "./admin/QuickActions";
import SystemAlerts from "./admin/SystemAlerts";
import UserDashboard from "./UserDashboard";

const AdminPanel = () => {
  const { toast } = useToast();
  const { signOut, userProfile } = useAuth();
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Risk Management Assistant",
      status: "active",
      type: "risk",
      performance: "97% accuracy",
      lastActive: "Nu",
      department: "Risk Management",
      expertise: ["Risk Analysis", "Portfolio Management", "Market Risk"]
    },
    {
      id: "2",
      name: "Trading Bot Alpha",
      status: "active",
      type: "trading",
      performance: "+15.4%",
      lastActive: "Nu",
      department: "Trading",
      expertise: ["Technical Analysis", "Market Making", "Trend Following"]
    },
    {
      id: "3",
      name: "Compliance Monitor",
      status: "active",
      type: "compliance",
      performance: "100% compliance",
      lastActive: "5 min geleden",
      department: "Compliance",
      expertise: ["Regulatory Compliance", "KYC/AML", "Audit Support"]
    },
    {
      id: "4",
      name: "Financial Analyst",
      status: "paused",
      type: "finance",
      performance: "98% accuracy",
      lastActive: "1 uur geleden",
      department: "Finance",
      expertise: ["Financial Analysis", "Reporting", "Budgeting"]
    },
    {
      id: "5",
      name: "Security Guardian",
      status: "active",
      type: "security",
      performance: "99.9% uptime",
      lastActive: "Nu",
      department: "Security",
      expertise: ["Threat Detection", "Access Control", "Security Monitoring"]
    },
    {
      id: "6",
      name: "Legal Advisor",
      status: "active",
      type: "legal",
      performance: "100% compliance",
      lastActive: "10 min geleden",
      department: "Legal",
      expertise: ["Regulatory Compliance", "Contract Analysis", "Legal Risk Assessment"]
    }
  ]);

  const [userCount, setUserCount] = useState(1234);
  const [systemLoad, setSystemLoad] = useState(67);
  const [errorRate, setErrorRate] = useState(0.5);

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
      lastActive: "Nooit",
      department: "N/A",
      expertise: []
    };

    setAgents(current => [...current, newAgent]);
    
    toast({
      title: "Nieuwe Agent Toegevoegd",
      description: "AI Agent is klaar voor configuratie",
    });
  };

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
          userCount={userCount}
          systemLoad={systemLoad}
          errorRate={errorRate}
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
