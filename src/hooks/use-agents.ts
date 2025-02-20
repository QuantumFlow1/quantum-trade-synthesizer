
import { useState } from "react";
import { Agent } from "@/types/agent";
import { useToast } from "@/hooks/use-toast";

export const useAgents = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "trading-bot-1",
      name: "Alpha Trading AI",
      status: "active",
      type: "trader",
      description: "Geavanceerde trading bot met multiple strategy support",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      performance: {
        successRate: 68.5,
        tasksCompleted: 1247
      }
    },
    {
      id: "1",
      name: "Risk Management Assistant",
      status: "active",
      type: "analyst",
      description: "AI voor risico analyse en portfolio management",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      performance: {
        successRate: 97,
        tasksCompleted: 450
      }
    },
    {
      id: "2",
      name: "Trading Advisor",
      status: "active",
      type: "advisor",
      description: "Trading advies en markt analyse",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      performance: {
        successRate: 85.4,
        tasksCompleted: 892
      }
    }
  ]);

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
      id: `agent-${agents.length + 1}`,
      name: "Nieuwe AI Assistant",
      status: "paused",
      type: "advisor",
      description: "Nieuwe AI assistent wacht op configuratie",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      performance: {
        successRate: 0,
        tasksCompleted: 0
      }
    };

    setAgents(current => [...current, newAgent]);
    
    toast({
      title: "Nieuwe AI Agent Toegevoegd",
      description: "AI Agent is klaar voor configuratie",
    });
  };

  return {
    agents,
    handleAgentAction,
    handleAddAgent
  };
};
