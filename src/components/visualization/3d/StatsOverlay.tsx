
import { Badge } from "@/components/ui/badge";
import { Activity, Sparkles } from "lucide-react";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface StatsOverlayProps {
  avgPrice: number;
  priceChange: number;
  priceChangePercent: number;
  theme: ColorTheme;
}

export const StatsOverlay = ({ 
  avgPrice, 
  priceChange, 
  priceChangePercent,
  theme 
}: StatsOverlayProps) => {
  const priceChangeColor = priceChange >= 0 
    ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
    : theme === 'dark' ? 'text-red-400' : 'text-red-600';
    
  const priceChangeSymbol = priceChange >= 0 ? '▲' : '▼';
  
  return (
    <div className="absolute top-4 right-6 z-10 flex flex-col space-y-2">
      <Badge className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5" aria-hidden="true" /> 
        <span>Avg: ${avgPrice.toFixed(2)}</span>
      </Badge>
      <Badge className={`bg-black/20 ${priceChangeColor} border-white/10 flex items-center gap-1.5`}>
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> 
        <span>
          {priceChangeSymbol} ${Math.abs(priceChange).toFixed(2)} 
          ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
        </span>
      </Badge>
    </div>
  );
};
