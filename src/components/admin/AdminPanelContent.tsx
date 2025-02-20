
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountManagementPanel from "./AccountManagementPanel";
import DashboardView from "./DashboardView";
import ModelManagement from "./ModelManagement";
import AIAgentsList from "./AIAgentsList";
import { Agent } from "@/types/agent";

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
  const [activeTab, setActiveTab] = useState("dashboard");

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
        <AIAgentsList agents={agents} setAgents={setAgents} />
      </TabsContent>

      <TabsContent value="models">
        <ModelManagement />
      </TabsContent>
    </Tabs>
  );
};

export default AdminPanelContent;
