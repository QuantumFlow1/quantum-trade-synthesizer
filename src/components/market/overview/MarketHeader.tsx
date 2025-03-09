
import React from "react";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";

interface MarketHeaderProps {
  showAIInsights: boolean;
  toggleAIInsights: () => void;
}

export const MarketHeader: React.FC<MarketHeaderProps> = ({ 
  showAIInsights, 
  toggleAIInsights 
}) => {
  return (
    <div className="relative flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
        Wereldwijde Markten
      </h2>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1.5 hover:bg-primary/20"
        onClick={toggleAIInsights}
      >
        <BrainCircuit className="h-4 w-4" />
        {showAIInsights ? "Hide AI Insights" : "Show AI Insights"}
      </Button>
    </div>
  );
};
