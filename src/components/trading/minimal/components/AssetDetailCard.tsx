
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Clock, DollarSign, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatNumber, formatPercentage, formatLargeNumber, formatSimpleDate } from "@/components/market/utils/formatters";

interface AssetDetailCardProps {
  assetData: any;
}

export const AssetDetailCard = ({ assetData }: AssetDetailCardProps) => {
  if (!assetData) return null;

  const isPositiveChange = (assetData.change24h || 0) >= 0;
  const isPositiveChange7d = (assetData.priceChange7d || 0) >= 0;
  const isPositiveChange30d = (assetData.priceChange30d || 0) >= 0;

  return (
    <Card className="overflow-hidden border-none shadow-md bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{assetData.name || assetData.symbol}</h3>
            <Badge variant="outline" className="text-xs font-normal">
              Rank #{assetData.rank || "N/A"}
            </Badge>
          </div>
          <div className="text-muted-foreground text-sm">
            {assetData.symbol} · {assetData.market || "Crypto"}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold">{formatCurrency(assetData.price)}</div>
          <div className={`flex items-center gap-1 text-sm ${isPositiveChange ? "text-green-500" : "text-red-500"}`}>
            {isPositiveChange ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {formatPercentage(assetData.change24h)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Market Cap
            </div>
            <div className="font-medium">{formatCurrency(assetData.marketCap)}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <BarChart3 className="h-3 w-3" /> 24h Volume
            </div>
            <div className="font-medium">{formatLargeNumber(assetData.volume || assetData.totalVolume24h)}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> 24h High
            </div>
            <div className="font-medium">{formatCurrency(assetData.high24h)}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3" /> 24h Low
            </div>
            <div className="font-medium">{formatCurrency(assetData.low24h)}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Last Updated
            </div>
            <div className="font-medium text-xs">
              {assetData.lastUpdated ? new Date(assetData.lastUpdated).toLocaleString() : "N/A"}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Circulating Supply</div>
            <div className="font-medium">{formatLargeNumber(assetData.circulatingSupply)}</div>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-3">
          <h4 className="text-sm font-medium mb-2">Price Trends</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-background/50 p-2">
              <div className="text-xs text-muted-foreground">24h</div>
              <div className={`text-sm font-medium ${isPositiveChange ? "text-green-500" : "text-red-500"}`}>
                {formatPercentage(assetData.change24h)}
              </div>
            </div>
            
            <div className="rounded-lg bg-background/50 p-2">
              <div className="text-xs text-muted-foreground">7d</div>
              <div className={`text-sm font-medium ${isPositiveChange7d ? "text-green-500" : "text-red-500"}`}>
                {formatPercentage(assetData.priceChange7d || assetData.change7d)}
              </div>
            </div>
            
            <div className="rounded-lg bg-background/50 p-2">
              <div className="text-xs text-muted-foreground">30d</div>
              <div className={`text-sm font-medium ${isPositiveChange30d ? "text-green-500" : "text-red-500"}`}>
                {formatPercentage(assetData.priceChange30d || assetData.change30d)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-3 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">All Time High</div>
            <div className="font-medium">{formatCurrency(assetData.ath)}</div>
            <div className="text-xs text-muted-foreground">
              {assetData.athDate ? formatSimpleDate(new Date(assetData.athDate).getTime()) : "N/A"}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">All Time Low</div>
            <div className="font-medium">{formatCurrency(assetData.atl)}</div>
            <div className="text-xs text-muted-foreground">
              {assetData.atlDate ? formatSimpleDate(new Date(assetData.atlDate).getTime()) : "N/A"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
