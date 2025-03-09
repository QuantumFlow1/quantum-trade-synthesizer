
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MarketMetricsProps {
  data: any[];
  useRealData?: boolean;
}

export const MarketMetrics = ({ data, useRealData = false }: MarketMetricsProps) => {
  const latestData = data.length > 0 ? data[data.length - 1] : null;
  
  if (!latestData) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Current Price</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${latestData.close.toFixed(2) || "0.00"}</p>
          <p className={`text-sm ${latestData.trend === "up" ? "text-green-500" : "text-red-500"}`}>
            {latestData.trend === "up" ? "↑" : "↓"} 
            {(Math.random() * 2).toFixed(2)}% Today
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${(latestData.volume / 1000000).toFixed(2)}M</p>
          <p className="text-sm text-gray-500">
            {useRealData ? "Based on real market data" : "Simulated market activity"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${latestData.trend === "up" ? "bg-green-500" : "bg-red-500"}`} 
                style={{ width: `${latestData.trend === "up" ? "75%" : "25%"}` }}
              ></div>
            </div>
          </div>
          <p className="mt-2 text-sm">
            {latestData.trend === "up" ? "Bullish" : "Bearish"} 
            {" "}({latestData.trend === "up" ? "75%" : "25%"})
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
