
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface UseOrderSectionProps {
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
  apiKeysAvailable?: boolean;
}

export const useOrderSection = ({
  isSimulationMode = false,
  onSimulationToggle,
  apiKeysAvailable = false
}: UseOrderSectionProps) => {
  const [localIsSimulationMode, setLocalIsSimulationMode] = useState(isSimulationMode);
  const [isKeySheetOpen, setIsKeySheetOpen] = useState(false);
  const prevSimModeRef = useRef(isSimulationMode);
  const prevApiKeysRef = useRef(apiKeysAvailable);
  const isProcessingToggleRef = useRef(false);

  const handleSimulationToggle = useCallback((enabled: boolean) => {
    // Prevent rapid toggles
    if (isProcessingToggleRef.current) return;
    isProcessingToggleRef.current = true;
    
    // Skip update if already in this mode
    if (localIsSimulationMode === enabled) {
      isProcessingToggleRef.current = false;
      return;
    }
    
    setLocalIsSimulationMode(enabled);
    
    if (onSimulationToggle) {
      onSimulationToggle(enabled);
    } else {
      if (enabled) {
        toast({
          title: "Simulation Mode Enabled",
          description: "You can now test trading without using real funds",
          duration: 3000,
        });
      }
    }
    
    // Reset processing flag after delay
    setTimeout(() => {
      isProcessingToggleRef.current = false;
    }, 250);
  }, [localIsSimulationMode, onSimulationToggle]);
  
  const handleApiKeySave = useCallback(() => {
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully. Reconnecting to services...",
      duration: 3000,
    });
    
    setIsKeySheetOpen(false);
  }, []);

  useEffect(() => {
    // Only update if the simulation mode or API keys status actually changed
    if (
      prevSimModeRef.current !== isSimulationMode || 
      prevApiKeysRef.current !== apiKeysAvailable
    ) {
      prevSimModeRef.current = isSimulationMode;
      prevApiKeysRef.current = apiKeysAvailable;
      setLocalIsSimulationMode(isSimulationMode);
    }
  }, [isSimulationMode, apiKeysAvailable]);

  return {
    localIsSimulationMode,
    isKeySheetOpen,
    setIsKeySheetOpen,
    handleSimulationToggle,
    handleApiKeySave
  };
};
