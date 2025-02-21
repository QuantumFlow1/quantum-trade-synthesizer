
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

  useEffect(() => {
    const receptionistExists = agents.some(agent => agent.type === "receptionist");
    if (!receptionistExists) {
      const receptionistAgent: Agent = {
        id: "receptionist-001",
        name: "QuantumFlow Receptionist",
        status: "active",
        type: "receptionist",
        description: "Geautomatiseerde receptioniste voor het QuantumFlow platform",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        tasks: [
          "Verwelkom nieuwe gebruikers en geef platformintroductie",
          "Beantwoord algemene vragen over QuantumFlow functionaliteiten",
          "Help bij navigatie door de verschillende modules",
          "Verzamel initiële gebruikersvoorkeuren en behoeften",
          "Assisteer bij het instellen van basisconfiguraties",
          "Verbind gebruikers met gespecialiseerde AI agents indien nodig",
          "Monitor gebruikerservaring en verzamel feedback",
          "Bied proactieve ondersteuning bij veelvoorkomende problemen",
          "Beheer gebruikersnotificaties en herinneringen",
          "Faciliteer de onboarding van nieuwe handelaren"
        ],
        performance: {
          successRate: 95,
          tasksCompleted: 0
        }
      };
      setAgents([...agents, receptionistAgent]);
    }
  }, [agents, setAgents]);

  const handleAgentAction = (agentId: string, action: "terminate" | "activate" | "pause") => {
    const updatedAgents = agents.map(agent => {
      if (agent.id === agentId) {
        const newStatus = action === "terminate" ? "terminated" as const : 
                         action === "pause" ? "paused" as const : "active" as const;
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
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="overview">
            <AccordionTrigger className="text-lg font-semibold">
              Platform Overzicht
            </AccordionTrigger>
            <AccordionContent>
              <DashboardView
                userCount={userCount}
                systemLoad={systemLoad}
                errorRate={errorRate}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>

      <TabsContent value="accounts">
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="management">
            <AccordionTrigger className="text-lg font-semibold">
              Account Beheer
            </AccordionTrigger>
            <AccordionContent>
              <AccountManagementPanel />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>

      <TabsContent value="agents">
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="ai-agents">
            <AccordionTrigger className="text-lg font-semibold">
              AI Assistenten
            </AccordionTrigger>
            <AccordionContent>
              <AIAgentsList 
                agents={agents}
                onAction={handleAgentAction}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>

      <TabsContent value="models">
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="advice-models">
            <AccordionTrigger className="text-lg font-semibold">
              Adviesmodellen
            </AccordionTrigger>
            <AccordionContent>
              <ModelManagement />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
    </Tabs>
  );
};

export default AdminPanelContent;
