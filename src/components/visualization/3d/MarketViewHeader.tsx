
import { Badge } from "@/components/ui/badge";
import { BarChart2 } from "lucide-react";

interface MarketViewHeaderProps {
  isSimulationMode: boolean;
}

export const MarketViewHeader = ({ isSimulationMode }: MarketViewHeaderProps) => {
  return (
    <div className="absolute top-4 left-6 z-10 flex items-center space-x-2">
      <h2 className="text-xl font-bold flex items-center">
        <BarChart2 className="w-5 h-5 mr-2" /> 
        3D Market Visualization
      </h2>
      {isSimulationMode && (
        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-600/30">
          Simulation
        </Badge>
      )}
    </div>
  );
};
