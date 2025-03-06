
import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export function useSimulationMode(handleRetryConnection: () => void) {
  const [forceSimulation, setForceSimulation] = useState(false);

  const toggleSimulationMode = useCallback((enabled: boolean) => {
    setForceSimulation(enabled);
    
    if (enabled) {
      toast({
        title: "Simulation Mode Enabled",
        description: "Using simulated data for trading functionality.",
        variant: "default",
      });
    } else {
      handleRetryConnection();
    }
  }, [handleRetryConnection]);

  return {
    forceSimulation,
    toggleSimulationMode
  };
}
