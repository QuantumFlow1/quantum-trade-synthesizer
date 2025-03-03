
import { useState, useEffect } from "react";
import { TradeOrderForm } from "./TradeOrderForm";
import PositionsList from "./PositionsList";
import SimulatedPositionsList from "./SimulatedPositionsList";
import TransactionList from "@/components/TransactionList";
import { usePositions } from "@/hooks/use-positions";
import { useSimulatedPositions } from "@/hooks/use-simulated-positions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CircleCheckBig, Info, Network, Key } from "lucide-react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { SimulationToggle } from "./SimulationToggle";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { CollaborativeInsightsPanel } from "./CollaborativeInsightsPanel";
import { useAgentNetwork } from "@/hooks/use-agent-network";
import { Badge } from "../ui/badge";
import { AIKeyConfigSheet } from "@/components/dashboard/advice/AIKeyConfigSheet";

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
  const { positions, isLoading: positionsLoading } = usePositions();
  const { positions: simulatedPositions, isLoading: simulatedPositionsLoading, closePosition } = useSimulatedPositions();
  const { isInitialized: isAgentNetworkInitialized, activeAgents, refreshAgentState } = useAgentNetwork();
  
  const [positionsTab, setPositionsTab] = useState(() => {
    // Initialize tab based on which positions are available
    return simulatedPositions.length > 0 ? "simulated" : "real";
  });
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
    // After saving, refresh the agent network state
    refreshAgentState();
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully. Reconnecting to services...",
      duration: 3000,
    });
    
    // Close the sheet
    setIsKeySheetOpen(false);
  };

  // Focus the simulated tab when simulation mode is enabled
  useEffect(() => {
    if (localIsSimulationMode) {
      setPositionsTab("simulated");
    }
  }, [localIsSimulationMode]);
  
  // Sync with parent component's simulation mode
  useEffect(() => {
    setLocalIsSimulationMode(isSimulationMode);
  }, [isSimulationMode]);

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="flex items-center justify-between">
        <SimulationToggle 
          enabled={localIsSimulationMode} 
          onToggle={handleSimulationToggle} 
        />
        
        {isAgentNetworkInitialized && activeAgents.length > 0 && (
          <Badge variant="outline" className="flex items-center gap-1 px-2">
            <Network className="h-3 w-3" />
            <span className="text-xs">{activeAgents.length} AI Agents Active</span>
          </Badge>
        )}
      </div>
      
      {effectiveApiStatus === 'unavailable' && !localIsSimulationMode && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Connection Issue</AlertTitle>
          <AlertDescription>
            {!apiKeysAvailable 
              ? "No API keys configured. Please set up API keys to enable trading functionality."
              : "Trading services are currently unavailable. You can view data but trading functionality is limited."
            }
            <div className="mt-2 flex flex-wrap gap-2">
              {!apiKeysAvailable && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  id="api-keys-config-btn"
                  onClick={() => setIsKeySheetOpen(true)}
                  className="bg-white/10"
                >
                  <Key className="h-3.5 w-3.5 mr-1" />
                  Configure API Keys
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSimulationToggle(true)}
                className="bg-white/10"
              >
                Enable Simulation Mode
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {effectiveApiStatus === 'checking' && !localIsSimulationMode && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Checking Trading Services</AlertTitle>
          <AlertDescription>
            Verifying connection to trading services...
          </AlertDescription>
        </Alert>
      )}

      {localIsSimulationMode && (
        <Alert variant="default" className="mb-4 bg-green-500/10 border-green-500">
          <CircleCheckBig className="h-4 w-4 text-green-500" />
          <AlertTitle>Simulation Mode Active</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Trading with simulated funds. No real money will be used.</p>
            <p className="text-sm text-muted-foreground"><Info className="h-3 w-3 inline mr-1" /> All trading functions work with fake currency in this mode.</p>
          </AlertDescription>
        </Alert>
      )}
      
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
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Positions</h3>
        
        <Tabs value={positionsTab} onValueChange={setPositionsTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="real">Real Positions</TabsTrigger>
            <TabsTrigger value="simulated" className={simulatedPositions.length > 0 ? "relative" : ""}>
              Simulated Positions
              {simulatedPositions.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {simulatedPositions.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="real" className="mt-4">
            <PositionsList positions={positions} isLoading={positionsLoading} />
          </TabsContent>
          
          <TabsContent value="simulated" className="mt-4">
            <SimulatedPositionsList 
              positions={simulatedPositions} 
              isLoading={simulatedPositionsLoading}
              onClosePosition={closePosition}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <TransactionList />
    </div>
  );
}
