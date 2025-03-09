
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star } from "lucide-react";

interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change: number;
  isFavorite?: boolean;
}

export const TradingPairsList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  
  const tradingPairs: TradingPair[] = [
    { symbol: "BTC/USDT", baseAsset: "BTC", quoteAsset: "USDT", price: 45000.00, change: 2.5, isFavorite: true },
    { symbol: "ETH/USDT", baseAsset: "ETH", quoteAsset: "USDT", price: 2500.00, change: 1.8, isFavorite: true },
    { symbol: "SOL/USDT", baseAsset: "SOL", quoteAsset: "USDT", price: 98.00, change: 3.2 },
    { symbol: "XRP/USDT", baseAsset: "XRP", quoteAsset: "USDT", price: 0.570, change: -1.2 },
    { symbol: "ADA/USDT", baseAsset: "ADA", quoteAsset: "USDT", price: 0.320, change: 0.7 },
    { symbol: "DOGE/USDT", baseAsset: "DOGE", quoteAsset: "USDT", price: 0.078, change: -0.5 },
    { symbol: "LINK/USDT", baseAsset: "LINK", quoteAsset: "USDT", price: 14.25, change: 4.3 },
    { symbol: "DOT/USDT", baseAsset: "DOT", quoteAsset: "USDT", price: 5.82, change: 1.1 }
  ];
  
  const filteredPairs = tradingPairs.filter(pair => {
    // Filter by search query
    if (searchQuery && !pair.symbol.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === "favorites" && !pair.isFavorite) {
      return false;
    }
    
    return true;
  });
  
  const handlePairSelect = (symbol: string) => {
    setSelectedPair(symbol);
    // We would typically update the chart here
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Select Trading Pair</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search pairs..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="max-h-[350px] overflow-y-auto px-2">
        <div className="space-y-1">
          {filteredPairs.map((pair) => (
            <Button
              key={pair.symbol}
              variant={selectedPair === pair.symbol ? "default" : "ghost"}
              className="w-full justify-between p-2"
              onClick={() => handlePairSelect(pair.symbol)}
            >
              <span className="font-medium">{pair.symbol}</span>
              <div className="text-right">
                <div className="font-bold">${pair.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`text-xs ${pair.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {pair.change >= 0 ? '+' : ''}{pair.change}%
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
