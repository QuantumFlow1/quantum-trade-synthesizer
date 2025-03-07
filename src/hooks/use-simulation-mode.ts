
import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { debounce } from "lodash";

export function useSimulationMode(handleRetryConnection: () => void) {
  const [forceSimulation, setForceSimulation] = useState(false);
  const prevStateRef = useRef(false);
  const isProcessingRef = useRef(false);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      isProcessingRef.current = false;
    };
  }, []);

  // Debounced function to handle state updates
  const debouncedToggleSimulation = useCallback(
    debounce((enabled: boolean) => {
      if (isProcessingRef.current) return;
      
      // Skip update if same value to avoid re-renders
      if (prevStateRef.current === enabled) return;
      
      isProcessingRef.current = true;
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
      
      // Reset processing flag after a short delay
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 300);
    }, 150),
    [handleRetryConnection]
  );

  // Exposed toggle function
  const toggleSimulationMode = useCallback((enabled: boolean) => {
    debouncedToggleSimulation(enabled);
  }, [debouncedToggleSimulation]);

  return {
    forceSimulation,
    toggleSimulationMode
  };
}
