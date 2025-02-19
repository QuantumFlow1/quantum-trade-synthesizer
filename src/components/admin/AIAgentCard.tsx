
import { Play, Pause, X, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Agent {
  id: string;
  name: string;
  status: "active" | "paused" | "terminated";
  type: "trading" | "analysis" | "risk" | "finance" | "compliance" | "security" | "legal";
  performance: string;
  lastActive: string;
  department: string;
  expertise: string[];
}

interface AIAgentCardProps {
  agent: Agent;
  onAction: (agentId: string, action: "terminate" | "activate" | "pause") => void;
}

const AIAgentCard = ({ agent, onAction }: AIAgentCardProps) => {
  return (
    <div className="p-4 rounded-lg bg-secondary/50 flex items-center justify-between">
      <div className="space-y-1">
        <div className="font-medium flex items-center gap-2">
          <Brain className="w-4 h-4" />
          {agent.name}
        </div>
        <div className="text-sm text-muted-foreground">
          Afdeling: {agent.department} • Expertise: {agent.expertise.join(", ")}
        </div>
        <div className="text-sm text-muted-foreground">
          Performance: {agent.performance} • Laatst actief: {agent.lastActive}
        </div>
        <div className={`text-sm ${
          agent.status === "active" ? "text-green-400" : 
          agent.status === "paused" ? "text-yellow-400" : 
          "text-red-400"
        }`}>
          Status: {agent.status}
        </div>
      </div>
      <div className="flex gap-2">
        {agent.status === "paused" ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAction(agent.id, "activate")}
          >
            <Play className="w-4 h-4 mr-1" />
            Activeer
          </Button>
        ) : agent.status === "active" ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAction(agent.id, "pause")}
          >
            <Pause className="w-4 h-4 mr-1" />
            Pauzeer
          </Button>
        ) : null}
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onAction(agent.id, "terminate")}
        >
          <X className="w-4 h-4 mr-1" />
          Beëindig
        </Button>
      </div>
    </div>
  );
};

export default AIAgentCard;
