
// This file re-exports the hook from the agent-network folder
// to maintain backward compatibility with existing imports
export { useAgentNetwork } from './agent-network';

// Re-export types needed by consumers
export type { UseAgentNetworkReturn } from './agent-network/types';
