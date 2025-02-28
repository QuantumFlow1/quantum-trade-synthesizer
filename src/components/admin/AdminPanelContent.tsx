
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
import ApiKeyManagement from "./ApiKeyManagement";
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
  systemLoad,
  errorRate,
}: AdminPanelContentProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    // Create a copy of the current agents array to avoid direct modification
    const updatedAgents = [...agents];
    const now = new Date().toISOString();
    
    // Check if receptionist exists, if not add it
    const receptionistExists = agents.some(agent => agent.type === "receptionist");
    if (!receptionistExists) {
      const receptionistAgent: Agent = {
        id: "receptionist-001",
        name: "QuantumFlow Receptionist",
        status: "active",
        type: "receptionist",
        description: "Geautomatiseerde receptioniste voor het QuantumFlow platform",
        createdAt: now,
        lastActive: now,
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
      updatedAgents.push(receptionistAgent);
    }
    
    // Check if data analyzer exists, if not add it
    const dataAnalyzerExists = agents.some(agent => agent.type === "analyst" && agent.name.includes("Data Analyzer"));
    if (!dataAnalyzerExists) {
      const dataAnalyzerAgent: Agent = {
        id: "analyst-001",
        name: "QuantumFlow Data Analyzer",
        status: "active",
        type: "analyst",
        description: "Geavanceerde data-analytische AI voor marktanalyse en patroonherkenning",
        createdAt: now,
        lastActive: now,
        tasks: [
          "Analyseer marktdata voor handelssignalen",
          "Identificeer trends en patronen in handelsbewegingen",
          "Bereken risico-parameters en optimale posities",
          "Voorspel marktvolatiliteit op basis van historische gegevens",
          "Genereer periodieke analyses van portefeuilleprestaties",
          "Identificeer correlaties tussen verschillende markten",
          "Voer sentimentanalyse uit op nieuws en sociale media",
          "Creëer gepersonaliseerde marktinzichten voor gebruikers",
          "Monitor ongewone marktbewegingen en waarschuw indien nodig",
          "Valideer trading strategieën via backtesting"
        ],
        performance: {
          successRate: 92,
          tasksCompleted: 145
        }
      };
      updatedAgents.push(dataAnalyzerAgent);
    }
    
    // Check if trader agent exists, if not add it
    const traderExists = agents.some(agent => agent.type === "trader");
    if (!traderExists) {
      const traderAgent: Agent = {
        id: "trader-001",
        name: "QuantumFlow Automated Trader",
        status: "active",
        type: "trader",
        description: "Geautomatiseerde handelsassistent voor het uitvoeren van handelstransacties",
        createdAt: now,
        lastActive: now,
        tasks: [
          "Voer handelstransacties uit op basis van signalen",
          "Beheer risico's door stop-loss en take-profit niveaus",
          "Optimaliseer order-routing voor beste uitvoering",
          "Pas positiegroottes aan op basis van volatiliteit",
          "Voer dollar-cost-averaging strategie uit",
          "Implementeer automatische rebalancing",
          "Monitor open posities en pas aan indien nodig",
          "Voer grid-trading strategieën uit",
          "Implementeer arbitrage tussen verschillende markten",
          "Rapporteer over handelsprestaties"
        ],
        performance: {
          successRate: 88,
          tasksCompleted: 78
        }
      };
      updatedAgents.push(traderAgent);
    }
    
    // Check if advisor agent exists, if not add it
    const advisorExists = agents.some(agent => agent.type === "advisor");
    if (!advisorExists) {
      const advisorAgent: Agent = {
        id: "advisor-001",
        name: "QuantumFlow Financial Advisor",
        status: "active",
        type: "advisor",
        description: "Persoonlijke financiële adviseur voor portefeuilleoptimalisatie",
        createdAt: now,
        lastActive: now,
        tasks: [
          "Geef gepersonaliseerd beleggingsadvies",
          "Optimaliseer asset allocatie gebaseerd op risicoprofiel",
          "Adviseer over diversificatiestrategieën",
          "Bied tax-loss harvesting aanbevelingen",
          "Geef inzicht in lange termijn markttrends",
          "Analyseer rendement versus risico van portefeuille",
          "Genereer periodieke adviesrapporten",
          "Pas advies aan op basis van marktsituatie",
          "Identificeer investeringskansen met hoogste potentieel",
          "Adviseer over herbalancering van portefeuille"
        ],
        performance: {
          successRate: 91,
          tasksCompleted: 112
        }
      };
      updatedAgents.push(advisorAgent);
    }
    
    // Only update the agents state if changes were made
    if (updatedAgents.length !== agents.length) {
      setAgents(updatedAgents);
      toast({
        title: "AI Agenten Bijgewerkt",
        description: "Alle benodigde AI agenten zijn geïnitialiseerd en actief.",
      });
    }
  }, [agents, setAgents, toast]);

  const handleAgentAction = (agentId: string, action: "terminate" | "activate" | "pause") => {
    const updatedAgents = agents.map(agent => {
      if (agent.id === agentId) {
        const newStatus = action === "terminate" ? "terminated" as const : 
                         action === "pause" ? "paused" as const : "active" as const;
        return { ...agent, status: newStatus, lastActive: new Date().toISOString() };
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

  // Fixed dashboard chapters with proper paths
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
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-background/80 backdrop-blur-sm">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="models">Advies Modellen</TabsTrigger>
          <TabsTrigger value="apikeys">API Sleutels</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardView 
              systemLoad={systemLoad}
              errorRate={errorRate}
            />
            
            <h2 className="text-xl font-bold mt-8 mb-4">Dashboard Secties</h2>
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
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="management">
                <AccordionTrigger>Account Beheer</AccordionTrigger>
                <AccordionContent>
                  <AccountManagementPanel />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="agents">
            <Accordion type="single" collapsible className="w-full" defaultValue="ai-agents">
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
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advice-models">
                <AccordionTrigger>Adviesmodellen</AccordionTrigger>
                <AccordionContent>
                  <ModelManagement />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="apikeys">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="api-keys">
                <AccordionTrigger>API Sleutelbeheer</AccordionTrigger>
                <AccordionContent>
                  <ApiKeyManagement />
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
