
import { useState } from "react";
import { TradeOrderForm } from "./TradeOrderForm";
import { ApiConnectionAlerts } from "./components/ApiConnectionAlerts";
import { AgentNetworkBadge } from "./components/AgentNetworkBadge";
import { PositionsTabsSection } from "./positions/PositionsTabsSection";
import { SimulationToggle } from "./SimulationToggle";
import TransactionList from "@/components/TransactionList";
import { CollaborativeInsightsPanel } from "./CollaborativeInsightsPanel";
import { AIKeyConfigSheet } from "@/components/dashboard/advice/AIKeyConfigSheet";
import { usePositions } from "@/hooks/use-positions";
import { useSimulatedPositions } from "@/hooks/use-simulated-positions";
import { useAgentNetwork } from "@/hooks/use-agent-network";
import { toast } from "@/hooks/use-toast";

interface TradingOrderSectionProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
  marketData?: any;
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
  apiKeysAvailable?: boolean;
}

export const TradingOrderSection = ({ 
  apiStatus, 
  marketData, 
  isSimulationMode = false, 
  onSimulationToggle,
  apiKeysAvailable = false
}: TradingOrderSectionProps) => {
  // Data hooks
  const { positions, isLoading: positionsLoading } = usePositions();
  const { positions: simulatedPositions, isLoading: simulatedPositionsLoading, closePosition } = useSimulatedPositions();
  const { isInitialized: isAgentNetworkInitialized, activeAgents, refreshAgentState } = useAgentNetwork();

  // Local state 
  const [localIsSimulationMode, setLocalIsSimulationMode] = useState(isSimulationMode);
  const [isKeySheetOpen, setIsKeySheetOpen] = useState(false);
  
  // Force API to be available for simulation mode
  const effectiveApiStatus = localIsSimulationMode ? 'available' : apiStatus;

  // Handle toggle of simulation mode
  const handleSimulationToggle = (enabled: boolean) => {
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
  };
  
  // Handle API key configuration save
  const handleApiKeySave = () => {
    refreshAgentState();
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully. Reconnecting to services...",
      duration: 3000,
    });
    
    // Close the sheet
    setIsKeySheetOpen(false);
  };

  return (
    <div className="lg:col-span-1 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <SimulationToggle 
          enabled={localIsSimulationMode} 
          onToggle={handleSimulationToggle} 
        />
        
        <AgentNetworkBadge 
          isInitialized={isAgentNetworkInitialized} 
          activeAgentsCount={activeAgents.length} 
        />
      </div>
      
      <ApiConnectionAlerts 
        apiStatus={effectiveApiStatus}
        isSimulationMode={localIsSimulationMode}
        apiKeysAvailable={apiKeysAvailable}
        onConfigApiKeys={() => setIsKeySheetOpen(true)}
        onEnableSimulation={() => handleSimulationToggle(true)}
      />
      
      <AIKeyConfigSheet
        isOpen={isKeySheetOpen}
        onOpenChange={setIsKeySheetOpen}
        onSave={handleApiKeySave}
      />
      
      <CollaborativeInsightsPanel currentData={marketData} />
      
      <TradeOrderForm 
        apiStatus={effectiveApiStatus} 
        isSimulationMode={localIsSimulationMode}
        onSimulationToggle={handleSimulationToggle}
      />
      
      <PositionsTabsSection 
        realPositions={positions}
        simulatedPositions={simulatedPositions}
        isRealPositionsLoading={positionsLoading}
        isSimulatedPositionsLoading={simulatedPositionsLoading}
        onCloseSimulatedPosition={closePosition}
        isSimulationMode={localIsSimulationMode}
      />
      
      <TransactionList />
    </div>
  );
};
