
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAgentNetwork } from "@/hooks/use-agent-network"; // Updated import path
import { Agent, AgentDetails, AgentMessage, AgentTask } from '@/types/agent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

export function AgentNetworkVisualizer() {
  const [activeTab, setActiveTab] = useState("network");
  const [isAnimating, setIsAnimating] = useState(false);
  const {
    agents,
    agentMessages,
    agentTasks,
    collaborationSessions,
    isInitialized,
    isLoading,
    refreshAgentState
  } = useAgentNetwork();

  useEffect(() => {
    if (!isInitialized) {
      refreshAgentState();
    }
  }, [isInitialized, refreshAgentState]);

  // Trigger animation effect when data updates
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [agents, agentMessages, agentTasks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="ml-2 text-gray-500">Loading agent network data...</p>
      </div>
    );
  }

  const renderMessages = () => {
    return (
      <div className="space-y-3">
        {agentMessages.length > 0 ? (
          agentMessages.map((message) => (
            <Card key={message.id} className="p-3 text-sm">
              <div className="flex justify-between mb-1">
                <Badge variant="outline">{message.fromAgent} → {message.toAgent}</Badge>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p>{message.message}</p>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No agent messages</p>
        )}
      </div>
    );
  };

  const renderTasks = () => {
    return (
      <div className="space-y-3">
        {agentTasks.length > 0 ? (
          agentTasks.map((task) => (
            <Card key={task.id} className="p-3 text-sm">
              <div className="flex justify-between mb-1">
                <Badge variant={task.status === 'completed' ? 'success' : task.status === 'pending' ? 'outline' : 'destructive'}>
                  {task.status}
                </Badge>
                <Badge variant="outline">{task.assignedTo}</Badge>
              </div>
              <p className="mb-1">{task.description}</p>
              {task.status === 'completed' && task.result && (
                <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  {task.result}
                </div>
              )}
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No agent tasks</p>
        )}
      </div>
    );
  };

  const renderCollaborations = () => {
    return (
      <div className="space-y-3">
        {collaborationSessions.length > 0 ? (
          collaborationSessions.map((session) => (
            <Card key={session.id} className="p-3 text-sm">
              <div className="flex justify-between mb-1">
                <Badge>{session.status}</Badge>
                <span className="text-xs text-gray-500">
                  {new Date(session.startTime).toLocaleString()}
                </span>
              </div>
              <p className="font-medium">{session.topic}</p>
              <div className="mt-2">
                <p className="text-xs text-gray-500">Participants:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {session.participants.map((participant) => (
                    <Badge key={participant} variant="outline" className="text-xs">
                      {participant}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No collaboration sessions</p>
        )}
      </div>
    );
  };

  const renderNetworkView = () => {
    // Convert AgentDetails to Agent type
    const agentsWithFullInfo: Agent[] = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      type: 'analyst', // Default type
      status: agent.isActive ? 'active' : 'offline', // Convert isActive to status
      lastActive: new Date().toISOString(),
      specialization: agent.specialization
    }));

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {agentsWithFullInfo.map((agent) => (
          <Card key={agent.id} className={`p-3 border-l-4 ${
            agent.status === 'active' ? 'border-l-green-500' : 
            agent.status === 'training' ? 'border-l-blue-500' : 
            agent.status === 'offline' ? 'border-l-gray-500' : 
            'border-l-yellow-500'
          } ${isAnimating ? 'animate-pulse' : ''}`}>
            <div className="flex justify-between">
              <h4 className="font-medium">{agent.name}</h4>
              <Badge variant={agent.status === 'active' ? 'success' : 'secondary'}>
                {agent.status}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">{agent.description}</p>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Type: {agent.type}</span>
              <span className="text-xs text-gray-500">
                Last active: {new Date(agent.lastActive).toLocaleTimeString()}
              </span>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="p-2">
      <Tabs defaultValue="network" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="network">
            Network <Badge className="ml-2">{agents.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-1" /> Messages <Badge className="ml-1">{agentMessages.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckCircle className="h-4 w-4 mr-1" /> Tasks <Badge className="ml-1">{agentTasks.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="collaborations">
            Collaborations <Badge className="ml-1">{collaborationSessions.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="network" className="mt-0">
          {renderNetworkView()}
        </TabsContent>
        
        <TabsContent value="messages" className="mt-0">
          {renderMessages()}
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-0">
          {renderTasks()}
        </TabsContent>
        
        <TabsContent value="collaborations" className="mt-0">
          {renderCollaborations()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
