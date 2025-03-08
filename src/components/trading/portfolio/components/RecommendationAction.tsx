
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Pause, Brain } from "lucide-react";

interface RecommendationActionProps {
  action: string;
}

export const RecommendationAction: React.FC<RecommendationActionProps> = ({ action }) => {
  // Function to get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case "BUY":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "SELL":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "HOLD":
        return <Pause className="h-4 w-4 text-yellow-500" />;
      default:
        return <Brain className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Badge 
      variant={action === "BUY" ? "success" : action === "SELL" ? "destructive" : "outline"}
      className="flex gap-1 items-center"
    >
      {getActionIcon(action)}
      {action}
    </Badge>
  );
};
