
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Send, Users, MessageSquare, ArrowRight, Calendar } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AgentCollaborationMessage {
  from: string;
  to: string;
  content: string;
  timestamp: string;
  impact?: number; // Impact score of this message (0-100)
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface AgentCollaborationProps {
  messages: AgentCollaborationMessage[];
  collaborationScore?: number; // Overall score of how well agents are working together (0-100)
  activeDiscussions?: Array<{topic: string, participants: string[], status: 'ongoing' | 'concluded'}>;
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

// Helper to format timestamp to relative time
const formatRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const AgentCollaboration: React.FC<AgentCollaborationProps> = ({ 
  messages, 
  collaborationScore = 0,
  activeDiscussions = []
}) => {
  if (!messages || messages.length === 0) {
    return null;
  }
  
  return (
    <TooltipProvider>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Agent Collaboration:
          </h3>
          
          {collaborationScore > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <div className="text-xs text-muted-foreground">Collaboration Score:</div>
                  <div className="relative w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full rounded-full ${
                        collaborationScore > 75 ? 'bg-green-500' : 
                        collaborationScore > 50 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${collaborationScore}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium">{collaborationScore}/100</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">How effectively agents are working together and sharing information</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        
        {activeDiscussions && activeDiscussions.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="text-xs text-muted-foreground">Active Discussions:</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeDiscussions.map((discussion, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <div className="text-xs px-2 py-0.5 rounded-full bg-secondary/70 flex items-center gap-1 cursor-help">
                      <span>{discussion.topic}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${discussion.status === 'ongoing' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-medium mb-1">Participants:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {discussion.participants.map((agent, i) => (
                          <span key={i} className={`${agentColorMap[agent] || 'text-primary'}`}>
                            {formatAgentName(agent)}
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        Status: {discussion.status === 'ongoing' ? 'In progress' : 'Concluded'}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
        
        <Card className="bg-card/50 border-border">
          <CardContent className="p-3 space-y-2 max-h-[200px] overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-shrink-0 mt-1">
                  <Send className={`h-3.5 w-3.5 ${message.sentiment === 'positive' ? 'text-green-500' : message.sentiment === 'negative' ? 'text-red-500' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-xs mb-1">
                    <span className={`font-medium ${agentColorMap[message.from] || 'text-primary'}`}>
                      {formatAgentName(message.from)}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className={`font-medium ${agentColorMap[message.to] || 'text-primary'}`}>
                      {message.to === 'all' ? 'All Agents' : formatAgentName(message.to)}
                    </span>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-muted-foreground text-[10px] flex items-center gap-1 ml-auto cursor-help">
                          <Calendar className="h-3 w-3" />
                          {formatRelativeTime(message.timestamp)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="text-xs">{new Date(message.timestamp).toLocaleString()}</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    {message.impact !== undefined && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`w-1.5 h-1.5 rounded-full cursor-help ${
                              message.impact > 75 ? 'bg-green-500' : 
                              message.impact > 40 ? 'bg-yellow-500' : 
                              'bg-gray-400'
                            }`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Message impact: {message.impact}/100</p>
                          <p className="text-xs text-muted-foreground">How much this message influenced the final decision</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{message.content}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};
