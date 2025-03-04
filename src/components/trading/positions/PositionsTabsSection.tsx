
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import PositionsList from "@/components/trading/PositionsList";
import SimulatedPositionsList from "@/components/trading/SimulatedPositionsList";
import { Position } from "@/hooks/use-positions";
import { SimulatedPosition } from "@/hooks/use-simulated-positions";

interface PositionsTabsSectionProps {
  realPositions: Position[];
  simulatedPositions: SimulatedPosition[];
  isRealPositionsLoading: boolean;
  isSimulatedPositionsLoading: boolean;
  onCloseSimulatedPosition: (id: string) => void;
  isSimulationMode: boolean;
}

export const PositionsTabsSection = ({
  realPositions,
  simulatedPositions,
  isRealPositionsLoading,
  isSimulatedPositionsLoading,
  onCloseSimulatedPosition,
  isSimulationMode
}: PositionsTabsSectionProps) => {
  const [positionsTab, setPositionsTab] = useState(() => {
    // Initialize tab based on which positions are available and simulation mode
    if (isSimulationMode || simulatedPositions.length > 0) {
      return "simulated";
    }
    return "real";
  });

  // Update active tab when simulation mode changes
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
          <PositionsList positions={realPositions} isLoading={isRealPositionsLoading} />
        </TabsContent>
        
        <TabsContent value="simulated" className="mt-4">
          <SimulatedPositionsList 
            positions={simulatedPositions} 
            isLoading={isSimulatedPositionsLoading}
            onClosePosition={onCloseSimulatedPosition}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
