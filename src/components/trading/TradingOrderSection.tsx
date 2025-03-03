
import { useState } from "react";
import { TradeOrderForm } from "./TradeOrderForm";
import PositionsList from "./PositionsList";
import SimulatedPositionsList from "./SimulatedPositionsList";
import TransactionList from "@/components/TransactionList";
import { usePositions } from "@/hooks/use-positions";
import { useSimulatedPositions } from "@/hooks/use-simulated-positions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

interface TradingOrderSectionProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
}

export const TradingOrderSection = ({ apiStatus }: TradingOrderSectionProps) => {
  const { positions, isLoading: positionsLoading } = usePositions();
  const { positions: simulatedPositions, isLoading: simulatedPositionsLoading, closePosition } = useSimulatedPositions();
  const [positionsTab, setPositionsTab] = useState("real");

  return (
    <div className="lg:col-span-1 space-y-6">
      {apiStatus === 'unavailable' && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Connection Issue</AlertTitle>
          <AlertDescription>
            Trading services are currently unavailable. You can view data but trading functionality is limited.
          </AlertDescription>
        </Alert>
      )}
      
      {apiStatus === 'checking' && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Checking Trading Services</AlertTitle>
          <AlertDescription>
            Verifying connection to trading services...
          </AlertDescription>
        </Alert>
      )}
      
      <TradeOrderForm apiStatus={apiStatus} />
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Positions</h3>
        
        <Tabs value={positionsTab} onValueChange={setPositionsTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="real">Real Positions</TabsTrigger>
            <TabsTrigger value="simulated">Simulated Positions</TabsTrigger>
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
