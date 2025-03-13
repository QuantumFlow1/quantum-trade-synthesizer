
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatisticsPanel from './StatisticsPanel';
import AccountManagementPanel from './AccountManagementPanel';
import ModelManagement from './ModelManagement';
import ApiKeyManagement from './ApiKeyManagement';
import SystemAlerts from './SystemAlerts';
import { TransactionAuditLog } from './TransactionAuditLog';
import { AgentNetworkDashboard } from './AgentNetworkDashboard';
import SuperAdminMonitor from './SuperAdminMonitor';
import GuideResourcesTab from './GuideResourcesTab';
import AIAgentsList from './AIAgentsList';
import { SuperAdminVoiceAssistant } from './SuperAdminVoiceAssistant';
import { Agent } from '@/types/agent';

interface AdminPanelContentProps {
  userRole?: string;
  agents?: Agent[];
  setAgents?: React.Dispatch<React.SetStateAction<Agent[]>>;
  userCount?: number;
  systemLoad?: number;
  errorRate?: number;
}

export const AdminPanelContent: React.FC<AdminPanelContentProps> = ({
  userRole = 'admin',
  agents = [],
  setAgents,
  userCount = 0,
  systemLoad = 0,
  errorRate = 0
}) => {
  const [activeTab, setActiveTab] = useState('statistics');

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="statistics">Statistieken</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="models">Modellen</TabsTrigger>
          <TabsTrigger value="apiKeys">API Keys</TabsTrigger>
          <TabsTrigger value="alerts">Systeem Alerts</TabsTrigger>
          <TabsTrigger value="auditLog">Audit Log</TabsTrigger>
          <TabsTrigger value="agentNetwork">Agent Network</TabsTrigger>
          <TabsTrigger value="superAdmin">Super Admin Monitor</TabsTrigger>
          <TabsTrigger value="voiceAssistant">Voice Assistant</TabsTrigger>
          <TabsTrigger value="guideResources">Guide & Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="statistics">
          <StatisticsPanel />
        </TabsContent>
        <TabsContent value="accounts">
          <AccountManagementPanel />
        </TabsContent>
        <TabsContent value="models">
          <ModelManagement />
        </TabsContent>
        <TabsContent value="apiKeys">
          <ApiKeyManagement />
        </TabsContent>
        <TabsContent value="alerts">
          <SystemAlerts />
        </TabsContent>
        <TabsContent value="auditLog">
          <TransactionAuditLog />
        </TabsContent>
        <TabsContent value="agentNetwork">
          <AgentNetworkDashboard />
        </TabsContent>
        <TabsContent value="superAdmin">
          <SuperAdminMonitor />
        </TabsContent>
        <TabsContent value="voiceAssistant">
          <SuperAdminVoiceAssistant />
        </TabsContent>
        <TabsContent value="guideResources">
          <GuideResourcesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
