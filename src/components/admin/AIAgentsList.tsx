
import { Agent } from "@/types/agent";
import AIAgentCard from "./AIAgentCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface AIAgentsListProps {
  agents: Agent[];
  setAgents: Dispatch<SetStateAction<Agent[]>>; // Add the missing prop
  onAction: (agentId: string, action: "terminate" | "activate" | "pause") => void;
}

const AIAgentsList = ({ agents, setAgents, onAction }: AIAgentsListProps) => {
  const activeAgents = agents.filter(agent => agent.status !== "terminated");
  
  // Sorteer agents in een specifieke volgorde:
  // 1. Receptioniste bovenaan
  // 2. Dan gesorteerd op type (advisor, trader, analyst)
  // 3. Binnen elk type, alfabetisch op naam
  const sortedAgents = [...activeAgents].sort((a, b) => {
    if (a.type === "receptionist") return -1;
    if (b.type === "receptionist") return 1;
    
    // Sorteer op type
    if (a.type !== b.type) {
      const typeOrder = { "advisor": 1, "trader": 2, "analyst": 3 };
      return (typeOrder[a.type as keyof typeof typeOrder] || 99) - 
             (typeOrder[b.type as keyof typeof typeOrder] || 99);
    }
    
    // Als types hetzelfde zijn, sorteer op naam
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Departement AI Assistenten</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Nieuwe Agent
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedAgents.map((agent) => (
          <AIAgentCard 
            key={agent.id} 
            agent={agent} 
            onAction={onAction}
          />
        ))}
      </div>
      
      {sortedAgents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Geen actieve AI assistenten gevonden.
        </div>
      )}
    </div>
  );
};

export default AIAgentsList;
