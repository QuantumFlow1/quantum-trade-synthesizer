
import { usePositions } from "@/hooks/use-positions";
import { useSimulatedPositions } from "@/hooks/use-simulated-positions";
import { useAgentConnection } from "@/hooks/use-agent-connection";
import { AIKeyConfigSheet } from "@/components/dashboard/advice/AIKeyConfigSheet";
import { TradeOrderForm } from "../TradeOrderForm";
import TransactionList from "@/components/TransactionList";

import { HeaderSection } from "./HeaderSection";
import { ApiStatusAlert } from "./ApiStatusAlert";
import { PositionsTabs } from "./PositionsTabs";
import { useOrderSection } from "./hooks/useOrderSection";

interface TradingOrderSectionProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
  marketData?: any;
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
  apiKeysAvailable?: boolean;
  isLoading?: boolean;
}

export const TradingOrderSection = ({ 
  apiStatus, 
  marketData, 
  isSimulationMode = false, 
  onSimulationToggle,
  apiKeysAvailable = false,
  isLoading = false
}: TradingOrderSectionProps) => {
  const { positions, isLoading: positionsLoading } = usePositions();
  const { positions: simulatedPositions, isLoading: simulatedPositionsLoading, closePosition } = useSimulatedPositions();
  const { isConnected, activeAgents } = useAgentConnection();
  
  const {
    localIsSimulationMode,
    isKeySheetOpen,
    setIsKeySheetOpen,
    handleSimulationToggle,
    handleApiKeySave
  } = useOrderSection({
    isSimulationMode,
    onSimulationToggle,
    apiKeysAvailable
  });
  
  const effectiveApiStatus = localIsSimulationMode ? 'available' : apiStatus;

  return (
    <div className="lg:col-span-1 space-y-6">
      <HeaderSection 
        isSimulationMode={localIsSimulationMode}
        onSimulationToggle={handleSimulationToggle}
        isConnected={isConnected}
        activeAgents={activeAgents}
      />
      
      <ApiStatusAlert 
        apiStatus={apiStatus}
        isSimulationMode={localIsSimulationMode}
        apiKeysAvailable={apiKeysAvailable || false}
        onConfigureApiKeys={() => setIsKeySheetOpen(true)}
        onEnableSimulation={() => handleSimulationToggle(true)}
      />
      
      <AIKeyConfigSheet
        isOpen={isKeySheetOpen}
        onOpenChange={setIsKeySheetOpen}
        onSave={handleApiKeySave}
      />
      
      <TradeOrderForm 
        apiStatus={effectiveApiStatus} 
        isSimulationMode={localIsSimulationMode}
        onSimulationToggle={handleSimulationToggle}
      />
      
      <PositionsTabs
        positions={positions}
        simulatedPositions={simulatedPositions}
        positionsLoading={positionsLoading}
        simulatedPositionsLoading={simulatedPositionsLoading}
        onClosePosition={closePosition}
        isSimulationMode={localIsSimulationMode}
      />
      
      <TransactionList />
    </div>
  );
};

export default TradingOrderSection;
