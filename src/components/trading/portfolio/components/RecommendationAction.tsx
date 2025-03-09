
import React from 'react';
import { ArrowUp, ArrowDown, MinusIcon, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecommendationActionProps {
  action: "BUY" | "SELL" | "HOLD" | "SHORT";
}

export const RecommendationAction: React.FC<RecommendationActionProps> = ({ action }) => {
  switch (action) {
    case "BUY":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          <ArrowUp className="h-3 w-3 mr-1" />
          Buy
        </Badge>
      );
    case "SELL":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
          <ArrowDown className="h-3 w-3 mr-1" />
          Sell
        </Badge>
      );
    case "HOLD":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          <MinusIcon className="h-3 w-3 mr-1" />
          Hold
        </Badge>
      );
    case "SHORT":
      return (
        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
          <TrendingDown className="h-3 w-3 mr-1" />
          Short
        </Badge>
      );
    default:
      return null;
  }
};
