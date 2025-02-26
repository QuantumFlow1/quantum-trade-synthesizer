
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export const MarketHeader = ({ isLoading, onRefresh }: MarketHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold flex items-center">
        <Activity className="w-5 h-5 mr-2" /> Market Data Integration
      </h2>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
      >
        Refresh Data
      </Button>
    </div>
  );
};
