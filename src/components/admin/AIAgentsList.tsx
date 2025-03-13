
import { useState, useEffect } from 'react';
import { Agent } from '@/types/agent';
import { AIAgentCard } from './AIAgentCard'; // Changed to named import
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export function AIAgentsList() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      // Fetch agents from API
      const { data, error } = await supabase.functions.invoke('agent-communication', {
        body: { action: 'list_agents' }
      });

      if (error) {
        console.error('Error fetching agents:', error);
        return;
      }

      setAgents(data?.agents || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgentAction = async (agentId: string, action: 'pause' | 'terminate' | 'activate') => {
    try {
      const { data, error } = await supabase.functions.invoke('agent-communication', {
        body: { 
          action: 'update_agent_status', 
          agentId, 
          status: action === 'pause' ? 'paused' : action === 'terminate' ? 'terminated' : 'active'
        }
      });

      if (error) {
        console.error(`Error ${action} agent:`, error);
        return;
      }

      // Update local state after successful API call
      fetchAgents();
    } catch (error) {
      console.error(`Error ${action} agent:`, error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <AIAgentCard 
            key={agent.id} 
            agent={agent}
            onAction={handleAgentAction}
          />
        ))}
      </div>
      
      {agents.length === 0 && (
        <div className="text-center p-10 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No AI agents available</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={fetchAgents}
          >
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
}
