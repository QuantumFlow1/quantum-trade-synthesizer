
import { Play, Pause, X, Brain, AlertTriangle, TrendingUp, BarChart2, Activity, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Agent } from "@/types/agent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AIAgentCardProps {
  agent: Agent;
  onAction: (agentId: string, action: "terminate" | "activate" | "pause") => void;
}

const AIAgentCard = ({ agent, onAction }: AIAgentCardProps) => {
  const renderMetrics = () => {
    if (!agent.metrics) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Win Rate</p>
          <p className="text-lg font-medium">{agent.metrics.winRate}%</p>
          <Progress value={agent.metrics.winRate} className="h-1" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Profit Factor</p>
          <p className="text-lg font-medium">{agent.metrics.profitFactor.toFixed(2)}</p>
          <Progress value={agent.metrics.profitFactor * 20} className="h-1" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
          <p className="text-lg font-medium">{agent.metrics.sharpeRatio.toFixed(2)}</p>
          <Progress value={agent.metrics.sharpeRatio * 20} className="h-1" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Drawdown</p>
          <p className="text-lg font-medium">{agent.metrics.maxDrawdown}%</p>
          <Progress value={100 - agent.metrics.maxDrawdown} className="h-1" />
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <CardTitle>{agent.name}</CardTitle>
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
        <CardDescription>
          Afdeling: {agent.department} • Type: {agent.type}
          {agent.collaborators && agent.collaborators.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">Samenwerking met {agent.collaborators.length} andere agents</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Performance: {agent.performance}</span>
          </div>
          {agent.tradingStrategy && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Strategie: {agent.tradingStrategy}</span>
            </div>
          )}
          {agent.technicalIndicators && (
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              <span className="text-sm">Indicators: {agent.technicalIndicators.join(", ")}</span>
            </div>
          )}
          {agent.primaryRole && (
            <div className="text-sm text-muted-foreground">
              Primaire rol: {agent.primaryRole}
              {agent.secondaryRoles && agent.secondaryRoles.length > 0 && (
                <span> • Secundaire rollen: {agent.secondaryRoles.join(", ")}</span>
              )}
            </div>
          )}
          <div className={`text-sm ${
            agent.status === "active" ? "text-green-400" : 
            agent.status === "paused" ? "text-yellow-400" : 
            "text-red-400"
          }`}>
            Status: {agent.status} • Laatst actief: {agent.lastActive}
          </div>
        </div>
        {renderMetrics()}
      </CardContent>
    </Card>
  );
};

export default AIAgentCard;
