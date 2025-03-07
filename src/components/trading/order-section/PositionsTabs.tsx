
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import PositionsList from "../PositionsList";
import SimulatedPositionsList from "../SimulatedPositionsList";

interface PositionsTabsProps {
  positions: any[];
  simulatedPositions: any[];
  positionsLoading: boolean;
  simulatedPositionsLoading: boolean;
  onClosePosition: (id: string) => void;
  isSimulationMode: boolean;
}

export const PositionsTabs = ({
  positions,
  simulatedPositions,
  positionsLoading,
  simulatedPositionsLoading,
  onClosePosition,
  isSimulationMode
}: PositionsTabsProps) => {
  const [positionsTab, setPositionsTab] = useState(() => {
    return simulatedPositions.length > 0 ? "simulated" : "real";
  });

  useEffect(() => {
    if (isSimulationMode) {
      setPositionsTab("simulated");
    }
  }, [isSimulationMode]);

  return (
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
            onClosePosition={onClosePosition}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
