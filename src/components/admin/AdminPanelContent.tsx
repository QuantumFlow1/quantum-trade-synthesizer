
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import StatisticsPanel from "./StatisticsPanel";
import { AIAgentsList } from "./AIAgentsList";
import SystemAlerts from "./SystemAlerts";
import SuperAdminMonitor from "./SuperAdminMonitor";
import { Agent } from "@/types/agent";
import { DashboardView } from "./DashboardView";
import { ModelManagement } from "./ModelManagement";
import { TransactionAuditLog } from "./TransactionAuditLog";
import { AuditRulesDemo } from "./audit/AuditRulesDemo";

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
  };

  return (
    <Tabs defaultValue="dashboard" value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-6 mb-6">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="agents">AI Agents</TabsTrigger>
        <TabsTrigger value="models">Models</TabsTrigger>
        <TabsTrigger value="audit">Transaction Audit</TabsTrigger>
        <TabsTrigger value="audit-rules">Audit Rules</TabsTrigger>
        <TabsTrigger value="system">System</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <DashboardView 
          userCount={userCount}
          systemLoad={systemLoad}
          errorRate={errorRate}
        />
      </TabsContent>

      <TabsContent value="agents">
        <AIAgentsList agents={agents} setAgents={setAgents} />
      </TabsContent>

      <TabsContent value="models">
        <ModelManagement />
      </TabsContent>

      <TabsContent value="audit">
        <TransactionAuditLog />
      </TabsContent>
      
      <TabsContent value="audit-rules">
        <AuditRulesDemo />
      </TabsContent>

      <TabsContent value="system">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatisticsPanel />
          <SystemAlerts />
          {userRole === "superadmin" && <SuperAdminMonitor />}
        </div>
      </TabsContent>
    </Tabs>
  );
};
