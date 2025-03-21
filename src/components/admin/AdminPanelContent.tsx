
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import StatisticsPanel from "./StatisticsPanel";
import AIAgentsList from "./AIAgentsList";
import SystemAlerts from "./SystemAlerts";
import SuperAdminMonitor from "./SuperAdminMonitor";
import { Agent } from "@/types/agent";
import DashboardView from "./DashboardView";
import { LLMUnifiedChat } from "./llm/LLMUnifiedChat";

interface AdminPanelContentProps {
  userRole: string;
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  userCount: number;
  systemLoad: number;
  errorRate: number;
}

export const AdminPanelContent = ({
  userRole,
  agents,
  setAgents,
  userCount,
  systemLoad,
  errorRate,
}: AdminPanelContentProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Log the tab change to help with debugging
    console.log(`Tab changed to: ${value}`);
  };

  return (
    <Tabs defaultValue="dashboard" value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="agents">AI Agents</TabsTrigger>
        <TabsTrigger value="system">System</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <DashboardView 
          userCount={userCount}
          systemLoad={systemLoad}
          errorRate={errorRate}
        />
      </TabsContent>

      <TabsContent value="agents">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <AIAgentsList 
              agents={agents} 
              setAgents={setAgents} 
              onAction={(agentId, action) => {
                console.log(`Agent ${agentId} action: ${action}`);
              }} 
            />
          </div>
          <div>
            <LLMUnifiedChat />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="system">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatisticsPanel />
          <SystemAlerts />
          {userRole === "superadmin" && <SuperAdminMonitor 
            userCount={userCount}
            systemLoad={systemLoad}
            errorRate={errorRate}
          />}
        </div>
      </TabsContent>

      <TabsContent value="settings">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
