
import { Card } from "@/components/ui/card";
import { MarketData } from "./types";
import { formatNumber } from "@/lib/utils";
import { Star } from "lucide-react";

interface MarketCardProps {
  market: MarketData;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string, e: React.MouseEvent) => void;
  onClick: () => void;
}

export const MarketCard = ({ market, isFavorite, onToggleFavorite, onClick }: MarketCardProps) => {
  const { symbol, name, price, change24h } = market;
  
  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{symbol}</h3>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        <Star 
          className={`w-5 h-5 cursor-pointer ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
          onClick={(e) => onToggleFavorite(symbol, e)}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="font-medium">${formatNumber(price)}</p>
        <p className={change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
          {change24h >= 0 ? '+' : ''}{formatNumber(change24h)}%
        </p>
      </div>
    </Card>
  );
};
