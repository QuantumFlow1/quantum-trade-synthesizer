
import { useState, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";

export function useSimulationMode(handleRetryConnection: () => void) {
  const [forceSimulation, setForceSimulation] = useState(false);
  const prevStateRef = useRef(false);

  const toggleSimulationMode = useCallback((enabled: boolean) => {
    // Skip update if same value to avoid re-renders
    if (prevStateRef.current === enabled) return;
    
    prevStateRef.current = enabled;
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
