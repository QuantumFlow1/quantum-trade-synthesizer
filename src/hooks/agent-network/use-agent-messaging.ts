
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/hooks/use-supabase';
import { AgentDetails } from '@/types/agent';
import { sendAgentMessage, fetchAgentMessages } from '@/services/agentNetwork';

export function useAgentMessaging(
  user: any,
  selectedAgent: AgentDetails | null,
  setAgentMessages: (messages: any[]) => void
) {
  const { executeQuery } = useSupabase();
  const { toast } = useToast();

  const syncMessages = useCallback(async () => {
    if (!user) return;
    
    try {
      const newMessages = await executeQuery(() => fetchAgentMessages(), 'Failed to fetch messages');
      if (newMessages) setAgentMessages(newMessages);
    } catch (error) {
      console.error('Failed to sync messages:', error);
    }
  }, [user, executeQuery, setAgentMessages]);

  const sendMessage = useCallback(async (message: string, toAgent?: string) => {
    if (!user || !message.trim()) return;
    
    try {
      const targetAgent = toAgent || (selectedAgent ? selectedAgent.id : null);
      
      if (!targetAgent) {
        toast({
          title: 'Message Error',
          description: 'No target agent selected',
          variant: 'destructive',
        });
        return;
      }
      
      const sent = await sendAgentMessage(message, targetAgent);
      
      if (sent) {
        toast({
          title: 'Message Sent',
          description: `Message sent to agent successfully`,
        });
        
        syncMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Message Failed',
        description: 'Could not send message to agent',
        variant: 'destructive',
      });
    }
  }, [user, selectedAgent, toast, syncMessages]);

  return {
    sendMessage,
    syncMessages
  };
}
