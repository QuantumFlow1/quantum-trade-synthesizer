
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const tradingAgentExists = agents.some(agent => agent.type === "trader");
    if (!tradingAgentExists) {
      const tradingAgent: Agent = {
        id: "trading-agent-001",
        name: "QuantumFlow Trading AI",
        status: "active",
        type: "trader",
        description: "Geautomatiseerde trading agent voor het QuantumFlow platform",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        tasks: [
          "Analyseer marktcondities en identificeer trading kansen",
          "Voer geautomatiseerde trades uit volgens risk management regels",
          "Monitor open posities en pas stop-loss/take-profit aan",
          "Genereer trading signalen en alerts",
          "Optimaliseer trading strategieën op basis van marktdata",
          "Voer backtesting uit op nieuwe strategieën",
          "Rapporteer trading prestaties en statistieken",
          "Beheer risico levels en position sizing",
          "Identificeer markt trends en patronen",
          "Integreer met externe data bronnen voor analyse"
        ],
        performance: {
          successRate: 85,
          tasksCompleted: 0
        }
      };
      setAgents([...agents, tradingAgent]);
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

  const dashboardChapters = [
    {
      title: "Platform Overzicht",
      path: "/admin/dashboard/overview",
      description: "Bekijk platform statistieken en prestaties",
      gradient: "from-purple-500/10 to-blue-500/10"
    },
    {
      title: "Gebruikers Analytics",
      path: "/admin/dashboard/users",
      description: "Analyse van gebruikersgedrag en activiteit",
      gradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      title: "Systeem Status",
      path: "/admin/dashboard/system",
      description: "Monitor systeemprestaties en resources",
      gradient: "from-cyan-500/10 to-emerald-500/10"
    },
    {
      title: "Financiële Rapportage",
      path: "/admin/dashboard/finance",
      description: "Overzicht van financiële metrics en transacties",
      gradient: "from-emerald-500/10 to-teal-500/10"
    }
  ];

  return (
    <div className="space-y-6 animate-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="models">Advies Modellen</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardChapters.map((chapter) => (
                <Button
                  key={chapter.path}
                  variant="outline"
                  className={`h-auto p-6 flex flex-col items-start space-y-3 w-full bg-gradient-to-br ${chapter.gradient} backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg`}
                  onClick={() => navigate(chapter.path)}
                >
                  <span className="text-xl font-semibold">{chapter.title}</span>
                  <span className="text-sm text-muted-foreground">{chapter.description}</span>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accounts">
            <Accordion type="single" collapsible>
              <AccordionItem value="management">
                <AccordionTrigger>Account Beheer</AccordionTrigger>
                <AccordionContent>
                  <AccountManagementPanel />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="agents">
            <Accordion type="single" collapsible>
              <AccordionItem value="ai-agents">
                <AccordionTrigger>AI Assistenten</AccordionTrigger>
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
            <Accordion type="single" collapsible>
              <AccordionItem value="advice-models">
                <AccordionTrigger>Adviesmodellen</AccordionTrigger>
                <AccordionContent>
                  <ModelManagement />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminPanelContent;
