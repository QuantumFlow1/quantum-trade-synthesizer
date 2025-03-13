
import { Agent } from '@/types/agent';

/**
 * Safely get agent tasks, handling both array and object formats
 * @param agent The agent object
 * @returns An array of task strings or empty array if no tasks
 */
export function getAgentTasks(agent: Agent): string[] {
  if (!agent.tasks) {
    return [];
  }
  
  // Handle string array format
  if (Array.isArray(agent.tasks)) {
    return agent.tasks;
  }
  
  // Handle object format with pending/completed
  if (typeof agent.tasks === 'object' && 'pending' in agent.tasks && 'completed' in agent.tasks) {
    // We need to safely handle the 'completed' property that might not exist on string[]
    const completedTasks = agent.tasks.completed || 0;
    const pendingTasks = agent.tasks.pending || 0;
    
    // Convert to array of numbered tasks
    const totalTasks = pendingTasks + completedTasks;
    return Array.from({ length: totalTasks }, (_, i) => 
      i < completedTasks 
        ? `Task ${i+1}: Completed` 
        : `Task ${i+1}: Pending`
    );
  }
  
  return [];
}

/**
 * Format agent ID for display
 * @param agentId Raw agent ID
 * @returns Formatted agent ID
 */
export function formatAgentId(agentId: string): string {
  return agentId
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Calculate agent success rate from performance data
 * @param agent The agent object
 * @returns Success rate as a percentage
 */
export function getAgentSuccessRate(agent: Agent): number {
  if (!agent.performance) {
    return 0;
  }
  
  return agent.performance.successRate;
}
