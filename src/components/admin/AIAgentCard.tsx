
import React from "react";
import { Agent } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAgentTasks, formatAgentId, getAgentSuccessRate } from "@/utils/agentHelpers";
import { Bot, Zap, CheckCircle2, XCircle, PauseCircle, PlayCircle, Archive } from "lucide-react";

export interface AIAgentCardProps {
  agent: Agent;
  onAction?: (agentId: string, action: "pause" | "terminate" | "activate") => void;
}

export function AIAgentCard({ agent, onAction }: AIAgentCardProps) {
  // Format the agent's tasks for display
  const tasks = getAgentTasks(agent);
  const formattedId = formatAgentId(agent.id);
  const successRate = getAgentSuccessRate(agent);

  // Get status badge color
  const getStatusBadgeColor = () => {
    switch (agent.status) {
      case "active": return "bg-green-100 text-green-800";
      case "offline": return "bg-gray-100 text-gray-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "training": return "bg-blue-100 text-blue-800";
      case "terminated": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get the icon for the agent type
  const getAgentTypeIcon = () => {
    switch (agent.type) {
      case "trader": return <Zap className="h-4 w-4 text-amber-500" />;
      case "analyst": return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case "portfolio_manager": return <Bot className="h-4 w-4 text-indigo-500" />;
      case "receptionist": return <Bot className="h-4 w-4 text-pink-500" />;
      case "advisor": return <Bot className="h-4 w-4 text-green-500" />;
      default: return <Bot className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get the action buttons based on current status
  const renderActionButtons = () => {
    if (!onAction) return null;
    
    switch (agent.status) {
      case "active":
        return (
          <Button variant="outline" size="sm" onClick={() => onAction(agent.id, "pause")}>
            <PauseCircle className="h-4 w-4 mr-1" />
            Pause
          </Button>
        );
      case "paused":
        return (
          <Button variant="outline" size="sm" onClick={() => onAction(agent.id, "activate")}>
            <PlayCircle className="h-4 w-4 mr-1" />
            Resume
          </Button>
        );
      case "offline":
      case "training":
        return (
          <Button variant="outline" size="sm" onClick={() => onAction(agent.id, "activate")}>
            <PlayCircle className="h-4 w-4 mr-1" />
            Activate
          </Button>
        );
      case "terminated":
        return null;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{agent.name}</CardTitle>
          <Badge className={getStatusBadgeColor()}>
            {agent.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-sm">
          {getAgentTypeIcon()}
          <span className="ml-1 capitalize">{agent.type.replace('_', ' ')}</span>
          {agent.specialization && (
            <span className="ml-1 text-muted-foreground">• {agent.specialization}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
        
        {/* Performance metrics */}
        {agent.performance && (
          <div className="grid grid-cols-2 gap-2 my-2">
            <div className="bg-slate-50 p-2 rounded text-center">
              <div className="text-lg font-medium">{successRate}%</div>
              <div className="text-xs text-muted-foreground">Success rate</div>
            </div>
            
            {agent.performance.tradeCount && (
              <div className="bg-slate-50 p-2 rounded text-center">
                <div className="text-lg font-medium">{agent.performance.tradeCount}</div>
                <div className="text-xs text-muted-foreground">Trades</div>
              </div>
            )}
            
            {agent.performance.tasksCompleted && (
              <div className="bg-slate-50 p-2 rounded text-center">
                <div className="text-lg font-medium">{agent.performance.tasksCompleted}</div>
                <div className="text-xs text-muted-foreground">Tasks</div>
              </div>
            )}
            
            {agent.performance.winLossRatio && (
              <div className="bg-slate-50 p-2 rounded text-center">
                <div className="text-lg font-medium">{agent.performance.winLossRatio}x</div>
                <div className="text-xs text-muted-foreground">Win/Loss</div>
              </div>
            )}
          </div>
        )}
        
        {/* Agent tasks */}
        {tasks && tasks.length > 0 && (
          <div className="mt-2">
            <h4 className="text-xs font-medium mb-1">Recent tasks</h4>
            <ul className="text-xs space-y-1">
              {tasks.slice(0, 3).map((task, index) => (
                <li key={index} className="flex items-center">
                  {task.includes("Completed") ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 text-amber-500 mr-1" />
                  )}
                  {task}
                </li>
              ))}
              {tasks.length > 3 && <li className="text-xs text-muted-foreground">+{tasks.length - 3} more</li>}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-muted-foreground">ID: {formattedId}</div>
        {renderActionButtons()}
      </CardFooter>
    </Card>
  );
}
