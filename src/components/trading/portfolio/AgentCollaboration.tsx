
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Send, Users } from "lucide-react";

interface AgentCollaborationMessage {
  from: string;
  to: string;
  content: string;
  timestamp: string;
}

interface AgentCollaborationProps {
  messages: AgentCollaborationMessage[];
}

// Map agent IDs to colors
const agentColorMap: Record<string, string> = {
  "value-investor": "text-blue-500",
  "technical-analyst": "text-purple-500",
  "sentiment-analyzer": "text-pink-500",
  "risk-manager": "text-yellow-500",
  "volatility-expert": "text-cyan-500",
  "macro-economist": "text-green-500",
  "all": "text-primary"
};

// Helper to format agent names
const formatAgentName = (agentId: string): string => {
  return agentId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const AgentCollaboration: React.FC<AgentCollaborationProps> = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
        <Users className="h-4 w-4 text-primary" />
        Agent Collaboration:
      </h3>
      
      <Card className="bg-card/50 border-border">
        <CardContent className="p-3 space-y-2 max-h-[200px] overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-shrink-0 mt-1">
                <Send className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 text-xs mb-1">
                  <span className={`font-medium ${agentColorMap[message.from] || 'text-primary'}`}>
                    {formatAgentName(message.from)}
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className={`font-medium ${agentColorMap[message.to] || 'text-primary'}`}>
                    {message.to === 'all' ? 'All Agents' : formatAgentName(message.to)}
                  </span>
                  <span className="text-muted-foreground text-[10px] ml-auto">
                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{message.content}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
