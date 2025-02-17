
import { ReactNode } from "react";

interface PriceCardProps {
  title: string;
  price: string;
  change: string;
  trend: "up" | "down";
  icon: ReactNode;
}

const PriceCard = ({ title, price, change, trend, icon }: PriceCardProps) => {
  return (
    <div className="glass-panel p-4 card-hover">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
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
