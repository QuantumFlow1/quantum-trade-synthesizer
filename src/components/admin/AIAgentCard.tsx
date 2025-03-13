
import React, { useState } from 'react';
import { Agent } from '@/types/agent';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Database, Eye, RefreshCw, Trash } from 'lucide-react';
import { getAgentTasks } from '@/utils/agentHelpers';

interface AIAgentCardProps {
  agent: Agent;
  onDelete?: (agentId: string) => void;
  onRefresh?: (agentId: string) => void;
  onView?: (agent: Agent) => void;
}

const AIAgentCard: React.FC<AIAgentCardProps> = ({
  agent,
  onDelete,
  onRefresh,
  onView
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Status badge color
  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-700';
      case 'offline':
        return 'bg-gray-500/20 text-gray-700';
      case 'training':
        return 'bg-blue-500/20 text-blue-700';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-700';
      case 'terminated':
        return 'bg-red-500/20 text-red-700';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
  };
  
  // Type badge color
  const getTypeColor = (type: Agent['type']) => {
    switch (type) {
      case 'trader':
        return 'bg-indigo-500/20 text-indigo-700';
      case 'analyst':
        return 'bg-cyan-500/20 text-cyan-700';
      case 'portfolio_manager':
        return 'bg-amber-500/20 text-amber-700';
      case 'advisor':
        return 'bg-green-500/20 text-green-700';
      case 'receptionist':
        return 'bg-teal-500/20 text-teal-700';
      case 'value_investor':
        return 'bg-purple-500/20 text-purple-700';
      case 'fundamentals_analyst':
        return 'bg-blue-500/20 text-blue-700';
      case 'technical_analyst':
        return 'bg-orange-500/20 text-orange-700';
      case 'valuation_expert':
        return 'bg-rose-500/20 text-rose-700';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
  };
  
  // Format trade success rate
  const formatSuccessRate = () => {
    if (agent.performance?.successRate !== undefined) {
      return `${agent.performance.successRate}%`;
    }
    return 'N/A';
  };
  
  // Handle refresh click
  const handleRefresh = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh(agent.id);
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };
  
  // Get tasks based on the agent format
  const tasks = getAgentTasks(agent);
  
  // Calculate task completion (for display)
  const getTaskCompletion = () => {
    if (Array.isArray(agent.tasks)) {
      const completedTasks = agent.tasks.filter(task => task.includes('Completed')).length;
      return `${completedTasks}/${agent.tasks.length}`;
    } else if (agent.tasks && typeof agent.tasks === 'object' && 'completed' in agent.tasks) {
      const total = agent.tasks.completed + agent.tasks.pending;
      return `${agent.tasks.completed}/${total}`;
    }
    return 'N/A';
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Bot className="h-5 w-5 mr-2 text-indigo-600" />
              {agent.name}
            </CardTitle>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant="outline" className={getStatusColor(agent.status)}>
                {agent.status}
              </Badge>
              <Badge variant="outline" className={getTypeColor(agent.type)}>
                {agent.type.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            ID: {agent.id.substring(0, 8)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{agent.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col">
            <span className="font-medium text-gray-700">Success Rate</span>
            <span>{formatSuccessRate()}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-700">Tasks</span>
            <span>{getTaskCompletion()}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-700">Last Active</span>
            <span>{new Date(agent.lastActive).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-700">Created</span>
            <span>{agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
        
        {tasks.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-medium text-gray-700 mb-1">Recent Tasks</h4>
            <ul className="text-xs space-y-1">
              {tasks.slice(0, 3).map((task, index) => (
                <li key={index} className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${task.includes('Completed') ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                  <span className="truncate">{task}</span>
                </li>
              ))}
              {tasks.length > 3 && (
                <li className="text-gray-500">+{tasks.length - 3} more tasks</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="flex space-x-2 w-full justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onView && onView(agent)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className={`flex-1 ${isRefreshing ? 'opacity-50' : ''}`}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete && onDelete(agent.id)}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIAgentCard;
