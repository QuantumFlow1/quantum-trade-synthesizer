
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/hooks/use-supabase';
import { createAgentTask, fetchAgentTasks, toggleAgentStatus } from '@/services/agentNetwork';

export function useAgentTasks(user: any, setAgentTasks: (tasks: any[]) => void) {
  const { executeQuery } = useSupabase();
  const { toast } = useToast();

  const createTask = useCallback(async (description: string, assignedTo: string) => {
    if (!user || !description.trim() || !assignedTo) return;
    
    try {
      const created = await createAgentTask(description, assignedTo);
      
      if (created) {
        toast({
          title: 'Task Created',
          description: 'New task assigned to agent',
        });
        
        const newTasks = await executeQuery(() => fetchAgentTasks(), 'Failed to fetch tasks');
        if (newTasks) setAgentTasks(newTasks);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      toast({
        title: 'Task Creation Failed',
        description: 'Could not create task for agent',
        variant: 'destructive',
      });
    }
  }, [user, executeQuery, toast, setAgentTasks]);

  const toggleAgent = useCallback(async (id: string) => {
    if (!user || !id) return;
    
    try {
      await toggleAgentStatus(id);
    } catch (error) {
      console.error('Failed to toggle agent status:', error);
    }
  }, [user]);

  return {
    createTask,
    toggleAgent
  };
}
