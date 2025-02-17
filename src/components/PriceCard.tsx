
import { ReactNode } from "react";

interface PriceCardProps {
  title: string;
  price: string;
  change: string;
  trend: "up" | "down";
  icon: ReactNode;
  market: "crypto" | "forex" | "stocks" | "commodities";
}

const PriceCard = ({ title, price, change, trend, icon, market }: PriceCardProps) => {
  return (
    <div className="glass-panel p-4 card-hover">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <span className="px-2 py-0.5 rounded-full text-xs bg-secondary/50 text-muted-foreground">
            {market}
          </span>
        </div>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold">{price}</span>
        <span
          className={`text-sm ${
            trend === "up" ? "text-green-400" : "text-red-400"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
};

export default PriceCard;
