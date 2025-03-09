
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

export const MarketSummary = () => {
  const summaryData = {
    lastUpdate: "0s ago",
    signal: "Bullish T.S.A.A. Signal",
    volatility: "0.90%",
    high24h: "$45,607.91",
    low24h: "$44,373.10",
    priceChange: "+0.53%",
    volume: "$2,691",
    avgPrice: "$44,980.71",
    priceRange: "$1,234.82",
    sentiment: "bullish"
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md">Market Summary</CardTitle>
          <span className="text-xs text-muted-foreground">{summaryData.lastUpdate}</span>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {summaryData.signal}
        </Badge>
        <div className="text-xs text-muted-foreground mt-1">Volatility: {summaryData.volatility}</div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-muted-foreground text-xs">24h High</div>
          <div className="font-medium">{summaryData.high24h}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">24h Low</div>
          <div className="font-medium">{summaryData.low24h}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Price Change</div>
          <div className="font-medium text-green-600">{summaryData.priceChange}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Volume</div>
          <div className="font-medium">{summaryData.volume}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Avg. Price</div>
          <div className="font-medium">{summaryData.avgPrice}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Price Range</div>
          <div className="font-medium">{summaryData.priceRange}</div>
        </div>
        <div className="col-span-2">
          <div className="text-muted-foreground text-xs">T.S.A.A. Sentiment</div>
          <div className="font-medium flex items-center mt-1">
            {summaryData.sentiment === "bullish" ? (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                Bullish
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                <ArrowDown className="h-3 w-3" />
                Bearish
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
