
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, Star, StarOff, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TradingPairSelectorProps {
  selectedPair: string;
  onPairChange: (pair: string) => void;
}

interface TradingPair {
  name: string;
  price: number;
  change24h: number;
  isFavorite: boolean;
}

export const TradingPairSelector = ({ selectedPair, onPairChange }: TradingPairSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pairs, setPairs] = useState<TradingPair[]>([
    { name: "BTC/USDT", price: 45000, change24h: 2.5, isFavorite: true },
    { name: "ETH/USDT", price: 2500, change24h: 1.8, isFavorite: true },
    { name: "SOL/USDT", price: 98, change24h: 3.2, isFavorite: false },
    { name: "XRP/USDT", price: 0.57, change24h: -1.2, isFavorite: false },
    { name: "ADA/USDT", price: 0.32, change24h: 0.7, isFavorite: false },
    { name: "DOGE/USDT", price: 0.078, change24h: -0.5, isFavorite: false },
    { name: "LINK/USDT", price: 14.25, change24h: 4.3, isFavorite: false },
    { name: "DOT/USDT", price: 5.82, change24h: 1.1, isFavorite: false },
  ]);
  
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  
  const toggleFavorite = (pairName: string) => {
    setPairs(pairs.map(pair => 
      pair.name === pairName 
        ? { ...pair, isFavorite: !pair.isFavorite } 
        : pair
    ));
  };
  
  const filteredPairs = pairs.filter(pair => {
    const matchesSearch = pair.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = activeTab === "all" || (activeTab === "favorites" && pair.isFavorite);
    return matchesSearch && matchesFavorites;
  });

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3 mt-1">
          <ArrowLeftRight className="h-5 w-5 text-primary" />
          <h3 className="text-base font-medium">Select Trading Pair</h3>
        </div>
        
        <div className="relative mb-3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search pairs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex mb-3 space-x-2">
          <Button 
            variant={activeTab === "all" ? "default" : "outline"} 
            size="sm" 
            className="flex-1"
            onClick={() => setActiveTab("all")}
          >
            All
          </Button>
          <Button 
            variant={activeTab === "favorites" ? "default" : "outline"} 
            size="sm" 
            className="flex-1"
            onClick={() => setActiveTab("favorites")}
          >
            Favorites
          </Button>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto pr-1">
          {filteredPairs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No pairs match your search
            </div>
          ) : (
            <div className="space-y-1">
              {filteredPairs.map((pair) => (
                <div 
                  key={pair.name}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted/50 ${
                    selectedPair === pair.name ? 'bg-muted' : ''
                  }`}
                  onClick={() => onPairChange(pair.name)}
                >
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(pair.name);
                      }}
                    >
                      {pair.isFavorite ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <span className="font-medium">{pair.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">${pair.price.toLocaleString('en-US', {
                      minimumFractionDigits: pair.price < 1 ? 3 : 2,
                      maximumFractionDigits: pair.price < 1 ? 6 : 2,
                    })}</div>
                    <div className={pair.change24h >= 0 ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                      {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
