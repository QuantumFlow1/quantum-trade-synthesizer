
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Agent } from "@/types/agent";
import { TrendingUp, Brain, PieChart, Shield, User, Bot, Activity, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AITradingAgentsProps {
  agents: Agent[];
}

export const AITradingAgents: React.FC<AITradingAgentsProps> = ({ 
  agents 
}) => {
  const { toast } = useToast();

  const getAgentIcon = (agent: Agent) => {
    const type = agent.type.toLowerCase();
    const name = agent.name.toLowerCase();
    
    if (name.includes('risk')) return <Shield className="h-5 w-5 text-orange-500" />;
    if (name.includes('portfolio')) return <PieChart className="h-5 w-5 text-blue-500" />;
    if (name.includes('advisor')) return <Brain className="h-5 w-5 text-purple-500" />;
    if (name.includes('analyst')) return <Activity className="h-5 w-5 text-green-500" />;
    
    switch (type) {
      case 'trader': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'analyst': return <Activity className="h-5 w-5 text-green-500" />;
      case 'advisor': return <Brain className="h-5 w-5 text-purple-500" />;
      case 'portfolio_manager': return <PieChart className="h-5 w-5 text-blue-500" />;
      default: return <Bot className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleActivateAgent = (agent: Agent) => {
    toast({
      title: `${agent.name} Activated`,
      description: "The AI agent is now actively monitoring the markets",
    });
  };
  
  const handleChatWithAgent = (agent: Agent) => {
    toast({
      title: `Chat with ${agent.name}`,
      description: "Opening direct communication with the AI agent",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">AI Trading Agents</h2>
        <Badge variant="outline" className="gap-1">
          <BrainCircuit className="h-3.5 w-3.5" />
          <span>{agents.length} Agents Available</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map(agent => (
          <Card key={agent.id} className="border-primary/20 transition-all hover:border-primary/50">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getAgentIcon(agent)}
                  <CardTitle className="text-base">{agent.name}</CardTitle>
                </div>
                <Badge variant={agent.status === 'active' ? "default" : "outline"}>
                  {agent.status === 'active' ? "Online" : "Offline"}
                </Badge>
              </div>
              <CardDescription className="text-xs mt-1">
                {agent.description || `AI ${agent.type} specialized in market analysis and trading`}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-0">
              <div className="bg-muted p-2 rounded-md">
                <div className="flex justify-between text-xs">
                  <div>Success Rate: <span className="font-medium">{agent.performance?.successRate || 0}%</span></div>
                  <div>Completed Tasks: <span className="font-medium">{agent.performance?.tasksCompleted || 0}</span></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-3">
              <Button 
                variant={agent.status === 'active' ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => handleActivateAgent(agent)}
              >
                <BrainCircuit className="h-4 w-4 mr-2" />
                {agent.status === 'active' ? "Deactivate" : "Activate"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => handleChatWithAgent(agent)}
              >
                <User className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
