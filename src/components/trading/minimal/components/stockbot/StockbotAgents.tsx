
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Robot, Briefcase, Brain, TrendingUp, PieChart, Shield } from "lucide-react";
import { Agent } from "@/types/agent";

interface StockbotAgentsProps {
  agents: Agent[];
}

export const StockbotAgents: React.FC<StockbotAgentsProps> = ({ agents }) => {
  // If no agents, provide default sample trading agents
  const displayedAgents = agents.length > 0 ? agents : [
    {
      id: "trading-bot-1",
      name: "Alpha Trading AI",
      status: "active",
      type: "trader",
      description: "Geavanceerde trading bot met multiple strategy support",
      performance: {
        successRate: 68.5,
        tasksCompleted: 1247
      }
    },
    {
      id: "risk-management",
      name: "Risk Management Assistant",
      status: "active",
      type: "analyst",
      description: "AI voor risico analyse en portfolio management",
      performance: {
        successRate: 97,
        tasksCompleted: 450
      }
    }
  ];

  // Get appropriate icon for agent type
  const getAgentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'trader':
        return <TrendingUp className="h-4 w-4" />;
      case 'analyst':
        return <PieChart className="h-4 w-4" />;
      case 'advisor':
        return <Briefcase className="h-4 w-4" />;
      case 'portfolio_manager':
        return <PieChart className="h-4 w-4" />;
      default:
        return <Robot className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Trading Agents</h3>
      <p className="text-sm text-muted-foreground mb-4">
        AI trading specialists can assist with market analysis and trading decisions
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedAgents.map(agent => (
          <Card key={agent.id} className="border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base flex items-center gap-2">
                  {getAgentIcon(agent.type)}
                  {agent.name}
                </CardTitle>
                <Badge variant={agent.status === 'active' ? "default" : "outline"}>
                  {agent.status === 'active' ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription className="text-xs">{agent.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between text-xs">
                <div>Success Rate: <span className="font-medium">{agent.performance?.successRate || 0}%</span></div>
                <div>Tasks: <span className="font-medium">{agent.performance?.tasksCompleted || 0}</span></div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
              >
                <Brain className="h-3.5 w-3.5 mr-2" />
                Chat with {agent.name.split(' ')[0]}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
