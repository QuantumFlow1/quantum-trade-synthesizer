
import { Agent } from "@/types/agent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, XCircle, Activity, WifiOff, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIAgentCardProps {
  agent: Agent;
  onAction: (agentId: string, action: "terminate" | "activate" | "pause") => void;
}

const AIAgentCard = ({ agent, onAction }: AIAgentCardProps) => {
  // Functie om een type-specifiek icoon te renderen
  const renderTypeIcon = () => {
    switch (agent.type) {
      case "receptionist":
        return "👋";
      case "advisor":
        return "💼";
      case "trader":
        return "📈";
      case "analyst":
        return "📊";
      default:
        return "🤖";
    }
  };
  
  // Functie om status badge te renderen met juiste kleuren
  const renderStatusBadge = () => {
    switch (agent.status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500/20 text-green-500 border border-green-500/50">
            <Activity className="h-3 w-3 mr-1" /> Actief
          </Badge>
        );
      case "paused":
        return (
          <Badge variant="default" className="bg-amber-500/20 text-amber-500 border border-amber-500/50">
            <Pause className="h-3 w-3 mr-1" /> Gepauzeerd
          </Badge>
        );
      case "terminated":
        return (
          <Badge variant="default" className="bg-red-500/20 text-red-500 border border-red-500/50">
            <WifiOff className="h-3 w-3 mr-1" /> Beëindigd
          </Badge>
        );
      default:
        return null;
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('nl-NL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Ongeldige datum';
    }
  };

  // Render agent tasks, handling both array and object formats
  const renderTasks = () => {
    if (!agent.tasks) return null;
    
    if (Array.isArray(agent.tasks)) {
      return (
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Primaire taken:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {agent.tasks.slice(0, 3).map((task, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-1">•</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Taken status:</p>
          <p className="text-xs text-muted-foreground">
            Voltooid: {agent.tasks.completed} | Wachtend: {agent.tasks.pending}
          </p>
        </div>
      );
    }
  };

  return (
    <Card className={`bg-secondary/30 backdrop-blur-sm border-secondary/50 hover:border-secondary/80 transition-all duration-300 ${agent.status === "terminated" ? "opacity-70" : ""}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <span className="text-xl">{renderTypeIcon()}</span>
            {agent.name}
          </span>
          <div className="flex gap-2">
            {renderStatusBadge()}
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
        <CardDescription className="flex justify-between">
          <span>Type: {agent.type}</span>
          <span className="text-xs text-muted-foreground">
            ID: {agent.id}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">{agent.description}</p>
          {agent.performance && (
            <div className="flex justify-between mt-3">
              <div className="text-sm text-muted-foreground">
                <p>Succes ratio: {agent.performance.successRate}%</p>
                <p>Voltooide taken: {agent.performance.tasksCompleted}</p>
              </div>
              <div className="text-sm">
                <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${agent.performance.successRate}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  Efficiency
                </p>
              </div>
            </div>
          )}
          {renderTasks()}
          <div className="text-xs text-muted-foreground mt-3 flex items-center justify-between">
            <span>
              Laatst actief: {formatDate(agent.lastActive)}
            </span>
            <span className="flex items-center">
              {agent.status === "active" ? (
                <Wifi className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500 mr-1" />
              )}
              {agent.status === "active" ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAgentCard;
