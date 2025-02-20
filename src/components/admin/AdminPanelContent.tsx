
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountManagementPanel from "./AccountManagementPanel";
import DashboardView from "./DashboardView";
import ModelManagement from "./ModelManagement";
import AIAgentsList from "./AIAgentsList";
import { Agent } from "@/types/agent";
import { useToast } from "@/hooks/use-toast";

interface AdminPanelContentProps {
  userRole: string;
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
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
  errorRate,
}: AdminPanelContentProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleAgentAction = (agentId: string, action: "terminate" | "activate" | "pause") => {
    // Update de agent status in de lijst
    const updatedAgents = agents.map(agent => {
      if (agent.id === agentId) {
        const newStatus = action === "terminate" ? "terminated" : 
                         action === "pause" ? "paused" : "active";
        return { ...agent, status: newStatus };
      }
      return agent;
    });
    
    setAgents(updatedAgents);
    
    toast({
      title: "Agent Status Bijgewerkt",
      description: `Agent ${agentId} is nu ${action === "terminate" ? "beëindigd" : 
                                           action === "pause" ? "gepauzeerd" : "geactiveerd"}`,
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="accounts">Accounts</TabsTrigger>
        <TabsTrigger value="agents">AI Agents</TabsTrigger>
        <TabsTrigger value="models">Advies Modellen</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <DashboardView
          userCount={userCount}
          systemLoad={systemLoad}
          errorRate={errorRate}
        />
      </TabsContent>

      <TabsContent value="accounts">
        <AccountManagementPanel />
      </TabsContent>

      <TabsContent value="agents">
        <AIAgentsList 
          agents={agents} 
          setAgents={setAgents} 
          onAction={handleAgentAction}
        />
      </TabsContent>

      <TabsContent value="models">
        <ModelManagement />
      </TabsContent>
    </Tabs>
  );
};

export default AdminPanelContent;
