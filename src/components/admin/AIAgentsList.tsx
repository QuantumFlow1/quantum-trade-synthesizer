
import { Agent } from "@/types/agent";
import AIAgentCard from "./AIAgentCard";
import { useToast } from "@/hooks/use-toast";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";

interface AIAgentsListProps {
  agents: Agent[];
  onAction: (agentId: string, action: "terminate" | "activate" | "pause") => void;
}

const AIAgentsList = ({ agents, onAction }: AIAgentsListProps) => {
  const { toast } = useToast();
  const activeAgents = agents.filter(agent => agent.status !== "terminated");
  
  // Group agents by type
  const agentsByType = {
    receptionist: activeAgents.filter(agent => agent.type === "receptionist"),
    advisor: activeAgents.filter(agent => agent.type === "advisor"),
    trader: activeAgents.filter(agent => agent.type === "trader"),
    analyst: activeAgents.filter(agent => agent.type === "analyst")
  };

  // Calculate aggregate metrics
  const totalActiveAgents = activeAgents.length;
  const averageSuccessRate = activeAgents.reduce((acc, agent) => 
    acc + (agent.performance?.successRate || 0), 0) / totalActiveAgents || 0;
  const totalTasksCompleted = activeAgents.reduce((acc, agent) => 
    acc + (agent.performance?.tasksCompleted || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/30 backdrop-blur-sm rounded-lg p-4 border border-secondary/50">
          <h4 className="text-sm font-medium mb-2">Active Agents</h4>
          <p className="text-2xl font-bold">{totalActiveAgents}</p>
        </div>
        <div className="bg-secondary/30 backdrop-blur-sm rounded-lg p-4 border border-secondary/50">
          <h4 className="text-sm font-medium mb-2">Avg Success Rate</h4>
          <p className="text-2xl font-bold">{averageSuccessRate.toFixed(1)}%</p>
        </div>
        <div className="bg-secondary/30 backdrop-blur-sm rounded-lg p-4 border border-secondary/50">
          <h4 className="text-sm font-medium mb-2">Total Tasks Completed</h4>
          <p className="text-2xl font-bold">{totalTasksCompleted}</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Agents</TabsTrigger>
          <TabsTrigger value="receptionist">Receptionists</TabsTrigger>
          <TabsTrigger value="advisor">Advisors</TabsTrigger>
          <TabsTrigger value="trader">Traders</TabsTrigger>
          <TabsTrigger value="analyst">Analysts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {activeAgents.map((agent) => (
            <AIAgentCard 
              key={agent.id} 
              agent={agent} 
              onAction={onAction}
            />
          ))}
        </TabsContent>

        <TabsContent value="receptionist" className="space-y-4">
          {agentsByType.receptionist.map((agent) => (
            <AIAgentCard 
              key={agent.id} 
              agent={agent} 
              onAction={onAction}
            />
          ))}
        </TabsContent>

        <TabsContent value="advisor" className="space-y-4">
          {agentsByType.advisor.map((agent) => (
            <AIAgentCard 
              key={agent.id} 
              agent={agent} 
              onAction={onAction}
            />
          ))}
        </TabsContent>

        <TabsContent value="trader" className="space-y-4">
          {agentsByType.trader.map((agent) => (
            <AIAgentCard 
              key={agent.id} 
              agent={agent} 
              onAction={onAction}
            />
          ))}
        </TabsContent>

        <TabsContent value="analyst" className="space-y-4">
          {agentsByType.analyst.map((agent) => (
            <AIAgentCard 
              key={agent.id} 
              agent={agent} 
              onAction={onAction}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAgentsList;

