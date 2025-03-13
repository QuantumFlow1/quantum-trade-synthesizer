
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketArrowProps {
  marketDirection: "up" | "down" | "neutral";
}

const MarketArrow: React.FC<MarketArrowProps> = ({ marketDirection }) => {
  if (marketDirection === "up") {
    return <TrendingUp className="inline-block ml-1 text-green-500 h-4 w-4" />;
  } else if (marketDirection === "down") {
    return <TrendingDown className="inline-block ml-1 text-red-500 h-4 w-4" />;
  }
  return null;
};

export default MarketArrow;
