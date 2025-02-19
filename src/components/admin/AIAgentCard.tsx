
import { Play, Pause, X, Brain, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Agent } from "@/types/agent";

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
          {agent.riskLevel && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              agent.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
              agent.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {agent.riskLevel.charAt(0).toUpperCase() + agent.riskLevel.slice(1)} Risk
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Afdeling: {agent.department} • Expertise: {agent.expertise.join(", ")}
        </div>
        <div className="text-sm text-muted-foreground">
          Performance: {agent.performance} • Laatst actief: {agent.lastActive}
        </div>
        {agent.capabilities && (
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Capabilities: {agent.capabilities.join(", ")}
          </div>
        )}
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
