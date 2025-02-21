
import { Agent } from "@/types/agent";
import AIAgentCard from "./AIAgentCard";

interface AIAgentsListProps {
  agents: Agent[];
  onAction: (agentId: string, action: "terminate" | "activate" | "pause") => void;
}

const AIAgentsList = ({ agents, onAction }: AIAgentsListProps) => {
  const activeAgents = agents.filter(agent => agent.status !== "terminated");
  
  // Sorteer agents zodat de receptioniste bovenaan staat
  const sortedAgents = [...activeAgents].sort((a, b) => {
    if (a.type === "receptionist") return -1;
    if (b.type === "receptionist") return 1;
    return 0;
  });

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4">Departement AI Assistenten</h3>
      <div className="space-y-4">
        {sortedAgents.map((agent) => (
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

