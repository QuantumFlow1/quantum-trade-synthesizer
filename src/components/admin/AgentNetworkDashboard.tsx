import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { AgentNetworkVisualizer } from "@/components/agent-network/AgentNetworkVisualizer";
import { useAgentNetwork } from "@/hooks/use-agent-network"; // Updated import path

export function AgentNetworkDashboard() {
  // Use the agent network hook to access agent data and functions
  const agentNetwork = useAgentNetwork();
  
  // On mount, initialize the agent network if not already initialized
  useEffect(() => {
    if (!agentNetwork.isInitialized && !agentNetwork.isLoading) {
      agentNetwork.initializeNetwork();
    }
  }, [agentNetwork.isInitialized, agentNetwork.initializeNetwork, agentNetwork.isLoading]);

  return (
    <Card className="col-span-2 row-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Agent Network Activity</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => agentNetwork.refreshAgentState()}
          disabled={agentNetwork.isLoading}
        >
          {agentNetwork.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="px-2 pb-2 pt-0">
        <AgentNetworkVisualizer />
      </CardContent>
    </Card>
  );
}
