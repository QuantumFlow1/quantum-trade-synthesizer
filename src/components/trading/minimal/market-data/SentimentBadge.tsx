
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface SentimentBadgeProps {
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export const SentimentBadge = ({ sentiment }: SentimentBadgeProps) => {
  return (
    <Badge 
      variant="outline" 
      className={`
        ${sentiment === 'bullish' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 
          sentiment === 'bearish' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 
          'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'}
      `}
    >
      {sentiment === 'bullish' ? (
        <TrendingUp className="h-3 w-3 mr-1" />
      ) : sentiment === 'bearish' ? (
        <TrendingDown className="h-3 w-3 mr-1" />
      ) : (
        <BarChart3 className="h-3 w-3 mr-1" />
      )}
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} T.S.A.A. Signal
    </Badge>
  );
};
