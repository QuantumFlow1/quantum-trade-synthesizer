
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Users, MessageSquare, BarChart2 } from 'lucide-react';
import { useAgentNetwork } from '@/hooks/use-agent-network';
import { Agent } from '@/types/agent';
import { AgentMessage, AgentTask } from '@/services/agentNetwork';

interface AgentCardProps {
  agent: Agent;
  onToggle: (agentId: string, isActive: boolean) => void;
}

const AgentCard = ({ agent, onToggle }: AgentCardProps) => (
  <div className="flex items-center justify-between p-4 border rounded-lg mb-3 bg-card hover:bg-accent/5 transition-colors">
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full mr-3 ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
      <div>
        <h3 className="font-medium">{agent.name}</h3>
        <p className="text-xs text-muted-foreground">{agent.description}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Badge variant={agent.type === 'advisor' ? 'default' : agent.type === 'analyst' ? 'outline' : 'secondary'}>
        {agent.type}
      </Badge>
      <button
        onClick={() => onToggle(agent.id, agent.status !== 'active')}
        className={`px-2 py-1 text-xs rounded-md transition-colors ${
          agent.status === 'active'
            ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
            : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
        }`}
      >
        {agent.status === 'active' ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  </div>
);

const MessageList = ({ messages }: { messages: AgentMessage[] }) => (
  <div className="space-y-3 max-h-[300px] overflow-y-auto">
    {messages.length === 0 ? (
      <p className="text-center text-muted-foreground p-4">No messages exchanged yet</p>
    ) : (
      messages.map((message) => (
        <div key={message.id} className="p-3 border rounded-lg">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>From: <strong>{message.fromAgent}</strong> to <strong>{message.toAgent}</strong></span>
            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
          <p className="text-sm">{message.content}</p>
        </div>
      ))
    )}
  </div>
);

const TaskList = ({ tasks }: { tasks: AgentTask[] }) => (
  <div className="space-y-3 max-h-[300px] overflow-y-auto">
    {tasks.length === 0 ? (
      <p className="text-center text-muted-foreground p-4">No tasks created yet</p>
    ) : (
      tasks.map((task) => (
        <div key={task.id} className="p-3 border rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">{task.description}</span>
            <Badge 
              variant={
                task.status === 'completed' ? 'default' :
                task.status === 'in-progress' ? 'secondary' :
                task.status === 'failed' ? 'destructive' : 'outline'
              }
            >
              {task.status}
            </Badge>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Agent: <strong>{task.agentId}</strong></span>
            <span>Priority: <strong>{task.priority}</strong></span>
          </div>
          {task.result && (
            <div className="mt-2 p-2 bg-muted rounded text-xs">
              <strong>Result:</strong> {task.result.substring(0, 100)}...
            </div>
          )}
        </div>
      ))
    )}
  </div>
);

export function AgentNetworkVisualizer() {
  const { 
    isInitialized,
    isLoading,
    activeAgents,
    agentMessages,
    agentTasks,
    toggleAgent,
    refreshAgentState
  } = useAgentNetwork();
  
  const [activeTab, setActiveTab] = useState('agents');
  
  useEffect(() => {
    // Refresh the state periodically
    const interval = setInterval(() => {
      refreshAgentState();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [refreshAgentState]);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" /> Agent Network Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && !isInitialized ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="agents" className="flex items-center gap-1">
                <Users className="h-4 w-4" /> Agents <Badge variant="outline">{activeAgents.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" /> Messages <Badge variant="outline">{agentMessages.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" /> Tasks <Badge variant="outline">{agentTasks.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="agents" className="mt-4">
              {activeAgents.map(agent => (
                <AgentCard 
                  key={agent.id} 
                  agent={agent} 
                  onToggle={toggleAgent} 
                />
              ))}
            </TabsContent>
            
            <TabsContent value="messages" className="mt-4">
              <MessageList messages={agentMessages} />
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-4">
              <TaskList tasks={agentTasks} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
