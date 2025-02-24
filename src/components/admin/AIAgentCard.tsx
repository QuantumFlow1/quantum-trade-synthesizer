
import { Agent } from "@/types/agent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, XCircle } from "lucide-react";

interface AIAgentCardProps {
  agent: Agent;
  onAction: (agentId: string, action: "terminate" | "activate" | "pause") => void;
}

const AIAgentCard = ({ agent, onAction }: AIAgentCardProps) => {
  return (
    <Card className="bg-secondary/30 backdrop-blur-sm border-secondary/50">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{agent.name}</span>
          <div className="flex gap-2">
            {agent.status !== "terminated" && (
              <>
                {agent.status === "paused" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAction(agent.id, "activate")}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAction(agent.id, "pause")}
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onAction(agent.id, "terminate")}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardTitle>
        <CardDescription>Type: {agent.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">{agent.description}</p>
          {agent.performance && (
            <div className="text-sm text-muted-foreground">
              <p>Succes ratio: {agent.performance.successRate}%</p>
              <p>Voltooide taken: {agent.performance.tasksCompleted}</p>
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            Laatst actief: {new Date(agent.lastActive).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAgentCard;
