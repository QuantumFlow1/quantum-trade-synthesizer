
import { Agent } from "@/types/agent";
import AIAgentCard from "./AIAgentCard";

interface AIAgentsListProps {
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  onAction: (agentId: string, action: "terminate" | "activate" | "pause") => void;
}

const AIAgentsList = ({ agents, onAction }: AIAgentsListProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4">Departement AI Assistenten</h3>
      <div className="space-y-4">
        {agents.filter(agent => agent.status !== "terminated").map((agent) => (
          <AIAgentCard 
            key={agent.id} 
            agent={agent} 
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  );
};

export default AIAgentsList;
