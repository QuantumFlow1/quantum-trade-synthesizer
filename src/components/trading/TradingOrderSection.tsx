
import { useState, useEffect } from "react";
import { TradeOrderForm } from "./TradeOrderForm";
import PositionsList from "./PositionsList";
import SimulatedPositionsList from "./SimulatedPositionsList";
import TransactionList from "@/components/TransactionList";
import { usePositions } from "@/hooks/use-positions";
import { useSimulatedPositions } from "@/hooks/use-simulated-positions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CircleCheckBig, Info } from "lucide-react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { SimulationToggle } from "./SimulationToggle";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";

interface TradingOrderSectionProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
}

export const TradingOrderSection = ({ apiStatus }: TradingOrderSectionProps) => {
  const { positions, isLoading: positionsLoading } = usePositions();
  const { positions: simulatedPositions, isLoading: simulatedPositionsLoading, closePosition } = useSimulatedPositions();
  const [positionsTab, setPositionsTab] = useState("simulated"); // Default to simulated tab
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  
  // Force API to be available for simulation mode
  const effectiveApiStatus = isSimulationMode ? 'available' : apiStatus;

  // Handle toggle of simulation mode
  const handleSimulationToggle = (enabled: boolean) => {
    setIsSimulationMode(enabled);
    if (enabled) {
      toast({
        title: "Simulation Mode Enabled",
        description: "You can now test trading without using real funds",
        duration: 3000,
      });
    }
  };

  // Focus the simulated tab when simulation mode is enabled
  useEffect(() => {
    if (isSimulationMode) {
      setPositionsTab("simulated");
    }
  }, [isSimulationMode]);

  return (
    <div className="lg:col-span-1 space-y-6">
      <SimulationToggle 
        enabled={isSimulationMode} 
        onToggle={handleSimulationToggle} 
      />
      
      {effectiveApiStatus === 'unavailable' && !isSimulationMode && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Connection Issue</AlertTitle>
          <AlertDescription>
            Trading services are currently unavailable. You can view data but trading functionality is limited.
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsSimulationMode(true)}
                className="bg-white/10"
              >
                Enable Simulation Mode
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {effectiveApiStatus === 'checking' && !isSimulationMode && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Checking Trading Services</AlertTitle>
          <AlertDescription>
            Verifying connection to trading services...
          </AlertDescription>
        </Alert>
      )}

      {isSimulationMode && (
        <Alert variant="default" className="mb-4 bg-green-500/10 border-green-500">
          <CircleCheckBig className="h-4 w-4 text-green-500" />
          <AlertTitle>Simulation Mode Active</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Trading with simulated funds. No real money will be used.</p>
            <p className="text-sm text-muted-foreground"><Info className="h-3 w-3 inline mr-1" /> All trading functions work with fake currency in this mode.</p>
          </AlertDescription>
        </Alert>
      )}
      
      <TradeOrderForm 
        apiStatus={effectiveApiStatus} 
        isSimulationMode={isSimulationMode}
        onSimulationToggle={setIsSimulationMode}
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
};
