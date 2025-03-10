
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageSquare, TrendingUp } from "lucide-react";
import { Agent } from "@/types/agent";
import { hasApiKey } from "@/utils/apiKeyManager";

interface AgentCardProps {
  agent: Agent;
  onChatWithAgent: (agent: Agent) => void;
  onConfigureApiKey?: () => void;
}

export function AgentCard({ agent, onChatWithAgent, onConfigureApiKey }: AgentCardProps) {
  const hasRequiredApiKey = hasApiKey('openai') || hasApiKey('groq');
  
  // Helper function to get agent type icon
  const getAgentIcon = () => {
    switch (agent.type) {
      case 'trader':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'analyst':
        return <Bot className="h-5 w-5 text-blue-500" />;
      case 'portfolio_manager':
        return <Bot className="h-5 w-5 text-purple-500" />;
      default:
        return <Bot className="h-5 w-5 text-indigo-500" />;
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {getAgentIcon()}
            <CardTitle className="text-lg">{agent.name}</CardTitle>
          </div>
          <Badge 
            variant={agent.status === 'active' ? 'default' : 'outline'} 
            className={agent.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
          >
            {agent.status}
          </Badge>
        </div>
        <CardDescription>{agent.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium capitalize">{agent.type.replace('_', ' ')}</span>
          </div>
          {agent.tradingStyle && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Style:</span>
              <span className="font-medium">{agent.tradingStyle}</span>
            </div>
          )}
          {agent.performance && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Success Rate:</span>
              <span className="font-medium">{agent.performance.successRate}%</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Active:</span>
            <span className="font-medium">{new Date(agent.lastActive).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        {hasRequiredApiKey ? (
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={() => onChatWithAgent(agent)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat with Agent
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onConfigureApiKey}
          >
            Configure AI Keys to Chat
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
