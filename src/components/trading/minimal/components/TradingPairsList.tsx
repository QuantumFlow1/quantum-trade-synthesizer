
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change: number;
  isFavorite?: boolean;
  assetType: 'crypto' | 'stock' | 'forex' | 'commodity';
}

export const TradingPairsList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>("all");
  
  const tradingPairs: TradingPair[] = [
    // Cryptocurrencies
    { symbol: "BTC/USDT", baseAsset: "BTC", quoteAsset: "USDT", price: 45000.00, change: 2.5, isFavorite: true, assetType: 'crypto' },
    { symbol: "ETH/USDT", baseAsset: "ETH", quoteAsset: "USDT", price: 2500.00, change: 1.8, isFavorite: true, assetType: 'crypto' },
    { symbol: "SOL/USDT", baseAsset: "SOL", quoteAsset: "USDT", price: 98.00, change: 3.2, assetType: 'crypto' },
    { symbol: "XRP/USDT", baseAsset: "XRP", quoteAsset: "USDT", price: 0.570, change: -1.2, assetType: 'crypto' },
    { symbol: "ADA/USDT", baseAsset: "ADA", quoteAsset: "USDT", price: 0.320, change: 0.7, assetType: 'crypto' },
    { symbol: "DOGE/USDT", baseAsset: "DOGE", quoteAsset: "USDT", price: 0.078, change: -0.5, assetType: 'crypto' },
    
    // Stocks
    { symbol: "AAPL", baseAsset: "AAPL", quoteAsset: "USD", price: 175.43, change: 0.8, assetType: 'stock' },
    { symbol: "MSFT", baseAsset: "MSFT", quoteAsset: "USD", price: 380.22, change: 1.2, assetType: 'stock' },
    { symbol: "GOOGL", baseAsset: "GOOGL", quoteAsset: "USD", price: 140.15, change: -0.5, assetType: 'stock' },
    { symbol: "AMZN", baseAsset: "AMZN", quoteAsset: "USD", price: 170.78, change: 2.1, assetType: 'stock' },
    { symbol: "TSLA", baseAsset: "TSLA", quoteAsset: "USD", price: 235.45, change: -1.8, assetType: 'stock' },
    { symbol: "META", baseAsset: "META", quoteAsset: "USD", price: 480.33, change: 3.2, assetType: 'stock' },
    
    // Forex
    { symbol: "EUR/USD", baseAsset: "EUR", quoteAsset: "USD", price: 1.0921, change: 0.05, assetType: 'forex' },
    { symbol: "GBP/USD", baseAsset: "GBP", quoteAsset: "USD", price: 1.2845, change: -0.12, assetType: 'forex' },
    { symbol: "USD/JPY", baseAsset: "USD", quoteAsset: "JPY", price: 156.78, change: 0.22, assetType: 'forex' },
    { symbol: "AUD/USD", baseAsset: "AUD", quoteAsset: "USD", price: 0.6712, change: -0.08, assetType: 'forex' },
    
    // Commodities
    { symbol: "GOLD", baseAsset: "XAU", quoteAsset: "USD", price: 2322.50, change: 0.45, assetType: 'commodity' },
    { symbol: "SILVER", baseAsset: "XAG", quoteAsset: "USD", price: 27.35, change: 0.65, assetType: 'commodity' },
    { symbol: "OIL", baseAsset: "CL", quoteAsset: "USD", price: 78.22, change: -1.12, assetType: 'commodity' }
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
    
    // Filter by asset type
    if (assetTypeFilter !== "all" && pair.assetType !== assetTypeFilter) {
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
        
        <div className="flex flex-col gap-2 mt-2">
          <Select
            value={assetTypeFilter}
            onValueChange={setAssetTypeFilter}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="crypto">Cryptocurrencies</SelectItem>
              <SelectItem value="stock">Stocks</SelectItem>
              <SelectItem value="forex">Forex</SelectItem>
              <SelectItem value="commodity">Commodities</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="max-h-[350px] overflow-y-auto px-2">
        {filteredPairs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No trading pairs match your search
          </div>
        ) : (
          <div className="space-y-1">
            {filteredPairs.map((pair) => (
              <Button
                key={pair.symbol}
                variant={selectedPair === pair.symbol ? "default" : "ghost"}
                className="w-full justify-between p-2"
                onClick={() => handlePairSelect(pair.symbol)}
              >
                <div className="flex items-center">
                  <span className="font-medium">{pair.symbol}</span>
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {pair.assetType === 'crypto' ? 'Crypto' : 
                     pair.assetType === 'stock' ? 'Stock' : 
                     pair.assetType === 'forex' ? 'Forex' : 'Commodity'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold">${pair.price.toLocaleString(undefined, {
                    minimumFractionDigits: pair.price < 10 ? 4 : 2,
                    maximumFractionDigits: pair.price < 10 ? 4 : 2
                  })}</div>
                  <div className={`text-xs ${pair.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {pair.change >= 0 ? '+' : ''}{pair.change}%
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
