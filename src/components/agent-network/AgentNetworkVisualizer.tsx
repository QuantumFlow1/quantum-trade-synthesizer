
import { useEffect, useState, useRef } from 'react';
import { Agent } from '@/types/agent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Network } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AgentMessage, AgentTask } from '@/services/agentNetwork';

interface AgentNetworkVisualizerProps {
  agents: Agent[];
  messages: AgentMessage[];
  tasks: AgentTask[];
  isLoading?: boolean;
}

export const AgentNetworkVisualizer = ({
  agents,
  messages,
  tasks,
  isLoading = false
}: AgentNetworkVisualizerProps) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visualizationReady, setVisualizationReady] = useState(false);
  
  // Initialize the visualization on component mount
  useEffect(() => {
    if (isLoading || !agents.length) return;
    
    try {
      if (canvasRef.current) {
        initializeVisualization();
      }
    } catch (error) {
      console.error('Error initializing agent network visualization:', error);
      toast({
        title: 'Visualization Error',
        description: 'Failed to initialize the agent network visualization',
        variant: 'destructive'
      });
    }
  }, [agents, messages, tasks, isLoading]);
  
  const initializeVisualization = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Draw agents as nodes
    drawAgentNodes(ctx, canvas);
    
    // Connect agents with message lines
    drawMessageLines(ctx);
    
    // Draw task indicators
    drawTaskIndicators(ctx);
    
    setVisualizationReady(true);
  };
  
  const drawAgentNodes = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    
    agents.forEach((agent, i) => {
      const angle = (i / agents.length) * Math.PI * 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Draw agent circle
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      
      // Choose color based on agent status
      switch (agent.status) {
        case 'active':
          ctx.fillStyle = 'rgba(34, 197, 94, 0.8)'; // green
          break;
        case 'paused':
          ctx.fillStyle = 'rgba(234, 179, 8, 0.8)'; // amber
          break;
        case 'offline':
          ctx.fillStyle = 'rgba(100, 116, 139, 0.8)'; // slate
          break;
        case 'terminated':
          ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'; // red
          break;
        default:
          ctx.fillStyle = 'rgba(59, 130, 246, 0.8)'; // blue
      }
      
      ctx.fill();
      ctx.stroke();
      
      // Draw agent label
      ctx.fillStyle = 'black';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(agent.name.slice(0, 15), x, y + 30);
    });
  };
  
  const drawMessageLines = (ctx: CanvasRenderingContext2D) => {
    // This would draw lines between agents that have communicated
    // Implementation would depend on how you want to visualize messages
    // Simplified version:
    messages.slice(0, 5).forEach(message => {
      const sender = agents.find(a => a.id === message.senderId);
      const receiver = agents.find(a => a.id === message.receiverId);
      
      if (sender && receiver) {
        // Get positions (simplified)
        // In a real implementation, you'd calculate positions based on the canvas
        // This is just a placeholder
        console.log(`Drawing message line from ${sender.name} to ${receiver.name}`);
      }
    });
  };
  
  const drawTaskIndicators = (ctx: CanvasRenderingContext2D) => {
    // This would draw indicators for active tasks
    // Simplified version
    tasks.slice(0, 5).forEach(task => {
      const agent = agents.find(a => a.id === task.agentId);
      
      if (agent) {
        // Draw task indicator (simplified)
        // In a real implementation, you'd position this relative to the agent
        console.log(`Drawing task indicator for ${agent.name}: ${task.title}`);
      }
    });
  };
  
  if (isLoading) {
    return (
      <Card className="col-span-full h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }
  
  if (!agents.length) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Network className="mr-2 h-5 w-5" />
            Agent Network
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No active agents available in the network</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Network className="mr-2 h-5 w-5" />
          Agent Network ({agents.length} Agents)
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <canvas 
          ref={canvasRef} 
          className="w-full h-[350px] bg-slate-50/5 rounded-md"
        />
        
        {!visualizationReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
