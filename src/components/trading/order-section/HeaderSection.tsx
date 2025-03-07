
import { Badge } from "@/components/ui/badge";
import { Network } from "lucide-react";
import { SimulationToggle } from "../SimulationToggle";

interface HeaderSectionProps {
  isSimulationMode: boolean;
  onSimulationToggle: (enabled: boolean) => void;
  isConnected: boolean;
  activeAgents: number;
}

export const HeaderSection = ({
  isSimulationMode,
  onSimulationToggle,
  isConnected,
  activeAgents
}: HeaderSectionProps) => {
  return (
    <div className="flex items-center justify-between">
      <SimulationToggle 
        enabled={isSimulationMode} 
        onToggle={onSimulationToggle} 
      />
      
      {isConnected && activeAgents > 0 && (
        <Badge variant="outline" className="flex items-center gap-1 px-2">
          <Network className="h-3 w-3" />
          <span className="text-xs">{activeAgents} AI Agents Active</span>
        </Badge>
      )}
    </div>
  );
};
