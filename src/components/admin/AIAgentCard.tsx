
import { Agent } from "@/types/agent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, XCircle, Activity, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface AIAgentCardProps {
  agent: Agent;
  onAction: (agentId: string, action: "terminate" | "activate" | "pause") => void;
}

const AIAgentCard = ({ agent, onAction }: AIAgentCardProps) => {
  // Calculate time since last active
  const timeSinceLastActive = new Date().getTime() - new Date(agent.lastActive).getTime();
  const minutesSinceLastActive = Math.floor(timeSinceLastActive / (1000 * 60));
  const hoursSinceLastActive = Math.floor(minutesSinceLastActive / 60);
  const daysSinceLastActive = Math.floor(hoursSinceLastActive / 24);

  const getLastActiveText = () => {
    if (daysSinceLastActive > 0) return `${daysSinceLastActive}d ago`;
    if (hoursSinceLastActive > 0) return `${hoursSinceLastActive}h ago`;
    if (minutesSinceLastActive > 0) return `${minutesSinceLastActive}m ago`;
    return 'Just now';
  };

  const getStatusColor = () => {
    switch (agent.status) {
      case 'active': return 'text-green-500';
      case 'paused': return 'text-yellow-500';
      case 'terminated': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-secondary/30 backdrop-blur-sm border-secondary/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>{agent.name}</span>
              <span className={`text-sm ${getStatusColor()}`}>
                •
              </span>
            </div>
            <div className="flex gap-2">
              {agent.status !== "terminated" && (
                <>
                  {agent.status === "paused" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAction(agent.id, "activate")}
                      className="hover:text-green-500"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAction(agent.id, "pause")}
                      className="hover:text-yellow-500"
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
          <CardDescription className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">{agent.description}</p>
            {agent.performance && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div className="text-sm">
                    <p className="font-medium">{agent.performance.successRate}%</p>
                    <p className="text-muted-foreground text-xs">Success Rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <div className="text-sm">
                    <p className="font-medium">{agent.performance.tasksCompleted}</p>
                    <p className="text-muted-foreground text-xs">Tasks Done</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Active {getLastActiveText()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AIAgentCard;

