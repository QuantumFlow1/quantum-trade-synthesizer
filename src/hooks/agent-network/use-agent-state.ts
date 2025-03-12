
import { useState, useCallback } from 'react';
import { useSupabase } from '@/hooks/use-supabase';
import { 
  AgentDetails, 
  AgentMessage, 
  AgentTask, 
  CollaborationSession 
} from '@/types/agent';
import { 
  fetchAgents, 
  fetchAgentMessages, 
  fetchAgentTasks, 
  fetchCollaborationSessions 
} from '@/services/agentNetwork';

export function useAgentState(user: any, isLoading: boolean, setIsLoading: (loading: boolean) => void) {
  const { executeQuery } = useSupabase();
  const [agents, setAgents] = useState<AgentDetails[]>([]);
  const [activeAgents, setActiveAgents] = useState<AgentDetails[]>([]);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [collaborationSessions, setCollaborationSessions] = useState<CollaborationSession[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentDetails | null>(null);

  const refreshAgentState = useCallback(async () => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    try {
      const [newAgents, newMessages, newTasks, newSessions] = await Promise.all([
        executeQuery(() => fetchAgents(), 'Failed to fetch agents'),
        executeQuery(() => fetchAgentMessages(), 'Failed to fetch messages'),
        executeQuery(() => fetchAgentTasks(), 'Failed to fetch tasks'),
        executeQuery(() => fetchCollaborationSessions(), 'Failed to fetch sessions')
      ]);
      
      if (newAgents) {
        setAgents(newAgents);
        setActiveAgents(newAgents.filter(agent => agent.isActive));
      }
      if (newMessages) setAgentMessages(newMessages);
      if (newTasks) setAgentTasks(newTasks);
      if (newSessions) setCollaborationSessions(newSessions);
    } catch (error) {
      console.error('Failed to refresh agent state:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoading, executeQuery, setIsLoading]);

  return {
    agents,
    activeAgents,
    agentMessages,
    agentTasks,
    collaborationSessions,
    selectedAgent,
    setSelectedAgent,
    refreshAgentState,
    setAgentMessages
  };
}
