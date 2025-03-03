import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MarketChartView } from "./MarketChartView";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, ExternalLink, MousePointer, TrendingDown, TrendingUp, Link, Globe, Twitter, Info, BarChart } from "lucide-react";
import { ChartData, MarketData } from "./types";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "../ui/separator";
import { formatCurrency, formatLargeNumber, formatPercentage } from "./utils/formatters";
import { generateChartData } from "./utils/chartDataGenerator";

interface MarketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketName: string | null;
  marketData: ChartData[];
}

export const MarketDetailModal = ({
  isOpen,
  onClose,
  marketName,
  marketData
}: MarketDetailModalProps) => {
  const [amount, setAmount] = useState<string>("0.01");
  const [leverage, setLeverage] = useState<string>("1");
  const [orderType, setOrderType] = useState<string>("market");
  const [currentTab, setCurrentTab] = useState<string>("chart");
  const [hasPositions, setHasPositions] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const latestData = marketData[marketData.length - 1];
  const previousPrice = marketData.length > 1 ? marketData[marketData.length - 2].price : latestData.price;
  const isPriceUp = latestData.price > previousPrice;
  const change24h = ((latestData.price - previousPrice) / previousPrice) * 100;

  const fullMarketData: MarketData = {
    symbol: marketName || "BTC/USD",
    name: marketName?.split('/')[0] || "Bitcoin",
    price: latestData.price,
    volume: latestData.volume,
    high: latestData.high,
    low: latestData.low,
    timestamp: Date.now(),
    change24h: change24h,
    high24h: Math.max(...marketData.map(d => d.price)),
    low24h: Math.min(...marketData.map(d => d.price)),
    marketCap: latestData.price * 19000000,
    totalVolume24h: latestData.volume,
    circulatingSupply: 19000000,
    totalSupply: 21000000,
    rank: 1,
    ath: latestData.price * 1.5,
    athDate: new Date().toISOString(),
    atl: latestData.price * 0.2,
    atlDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date().toISOString(),
    priceChange7d: change24h * 1.2,
    priceChange30d: change24h * 0.8,
  };

  useEffect(() => {
    if (!user || !marketName) return;

    const checkPositions = async () => {
      try {
        const { data: pairData } = await supabase
          .from("trading_pairs")
          .select("id")
          .eq("symbol", marketName)
          .maybeSingle();
        
        if (pairData?.id) {
          const { data: positions, error } = await supabase
            .from("positions")
            .select("*")
            .eq("user_id", user.id)
            .eq("pair_id", pairData.id);
          
          if (!error && positions && positions.length > 0) {
            setHasPositions(true);
          }
        }
      } catch (error) {
        console.error("Error checking positions:", error);
      }
    };

    checkPositions();
  }, [user, marketName, isOpen]);

  if (!marketName || !marketData.length) {
    return null;
  }

  const handleBuyClick = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to trade this asset",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: pairData, error: pairError } = await supabase
        .from("trading_pairs")
        .select("id")
        .eq("symbol", marketName)
        .maybeSingle();

      if (pairError) throw pairError;

      const pairId = pairData?.id || `${marketName.replace('/', '_')}_default`;
      
      const { error: tradeError } = await supabase.from("trades").insert({
        user_id: user.id,
        pair_id: pairId,
        type: "buy",
        amount: parseFloat(amount),
        price: latestData.price,
        status: "pending",
      });

      if (tradeError) throw tradeError;

      const { error: updateError } = await supabase.functions.invoke("update-positions", {
        body: {
          trade: {
            user_id: user.id,
            pair_id: pairId,
            type: "buy",
            amount: parseFloat(amount),
            price: latestData.price,
          }
        }
      });

      if (updateError) throw updateError;

      toast({
        title: "Position Opened",
        description: `Successfully opened a position for ${marketName}`,
      });
      
      setHasPositions(true);
      setTimeout(() => {
        setCurrentTab("positions");
      }, 1000);
    } catch (error) {
      console.error("Error opening position:", error);
      toast({
        title: "Error",
        description: "Failed to open position. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSellClick = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to trade this asset",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: pairData, error: pairError } = await supabase
        .from("trading_pairs")
        .select("id")
        .eq("symbol", marketName)
        .maybeSingle();

      if (pairError) throw pairError;

      const pairId = pairData?.id || `${marketName.replace('/', '_')}_default`;
      
      const { error: tradeError } = await supabase.from("trades").insert({
        user_id: user.id,
        pair_id: pairId,
        type: "sell",
        amount: parseFloat(amount),
        price: latestData.price,
        status: "pending",
      });

      if (tradeError) throw tradeError;

      toast({
        title: "Short Position Opened",
        description: `Successfully opened a short position for ${marketName}`,
      });
    } catch (error) {
      console.error("Error opening short position:", error);
      toast({
        title: "Error",
        description: "Failed to open position. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {marketName}
              <span className={`text-sm font-medium ${isPriceUp ? "text-green-500" : "text-red-500"}`}>
                {isPriceUp ? <TrendingUp className="h-4 w-4 inline" /> : <TrendingDown className="h-4 w-4 inline" />}
                ${latestData.price.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.open(`https://www.coingecko.com/en/coins/${marketName?.split('/')[0].toLowerCase()}`, "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                CoinGecko
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Detailed market information and trading options
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="chart" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="chart">Price & Chart</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
            <TabsTrigger value="positions" disabled={!hasPositions}>Your Positions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-6">
            <MarketChartView data={marketData} type="price" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-3">Market Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Cap</span>
                    <span className="font-medium">${formatLargeNumber(fullMarketData.marketCap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">24h Volume</span>
                    <span className="font-medium">${formatLargeNumber(fullMarketData.volume)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Circulating Supply</span>
                    <span className="font-medium">{formatLargeNumber(fullMarketData.circulatingSupply)}</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-3">Price Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">24h Change</span>
                    <span className={`font-medium ${isPriceUp ? "text-green-500" : "text-red-500"}`}>
                      {formatPercentage(fullMarketData.change24h)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">24h High / Low</span>
                    <span className="font-medium">
                      ${latestData.high.toFixed(2)} / ${latestData.low.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">All-Time High</span>
                    <span className="font-medium">${formatCurrency(fullMarketData.ath)}</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-3">Links</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => window.open(`https://www.coingecko.com/en/coins/${marketName?.split('/')[0].toLowerCase()}`, "_blank")}>
                    <Globe className="h-4 w-4 mr-2" />
                    Official Website
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => window.open(`https://twitter.com/search?q=%24${marketName?.split('/')[0]}`, "_blank")}>
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => window.open(`https://www.tradingview.com/symbols/${marketName?.replace('/', '')}`, "_blank")}>
                    <BarChart className="h-4 w-4 mr-2" />
                    TradingView
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trade">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 space-y-4">
                <h3 className="text-lg font-medium">Place Order</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="order-type">Order Type</Label>
                  <Select defaultValue={orderType} onValueChange={setOrderType}>
                    <SelectTrigger id="order-type">
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                      <SelectItem value="stop">Stop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="leverage">Leverage</Label>
                  <Select defaultValue={leverage} onValueChange={setLeverage}>
                    <SelectTrigger id="leverage">
                      <SelectValue placeholder="Select leverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                      <SelectItem value="5">5x</SelectItem>
                      <SelectItem value="10">10x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="advanced-options" />
                  <Label htmlFor="advanced-options">Enable advanced options</Label>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={handleBuyClick}>
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Buy
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleSellClick}>
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Sell
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 space-y-4">
                <h3 className="text-lg font-medium">Market Details</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="font-medium">${latestData.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24h Change</p>
                    <p className={`font-medium ${isPriceUp ? "text-green-500" : "text-red-500"}`}>
                      {formatPercentage(change24h)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24h High</p>
                    <p className="font-medium">${formatCurrency(fullMarketData.high24h)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24h Low</p>
                    <p className="font-medium">${formatCurrency(fullMarketData.low24h)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">AI Market Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Market sentiment is currently {isPriceUp ? 'positive' : 'negative'} with 
                    {Math.abs(change24h) > 5 ? ' high' : ' moderate'} volatility. 
                    {isPriceUp 
                      ? ' Technical indicators suggest continued upward momentum.' 
                      : ' Technical indicators suggest caution in the short term.'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Level:</span>
                    <span className={`text-sm font-medium ${
                      Math.abs(change24h) > 10 ? 'text-red-500' : 
                      Math.abs(change24h) > 5 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {Math.abs(change24h) > 10 ? 'High' : Math.abs(change24h) > 5 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full" onClick={() => window.open(`https://www.tradingview.com/symbols/${marketName?.replace('/', '')}`, "_blank")}>
                    <MousePointer className="h-4 w-4 mr-2" />
                    Open in Advanced Trading View
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="positions">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Your Positions for {marketName}</h3>
              
              {hasPositions ? (
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{marketName} Long Position</h4>
                        <p className="text-sm text-muted-foreground">Opened at ${latestData.price.toFixed(2)}</p>
                      </div>
                      <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isPriceUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isPriceUp ? 'Profit' : 'Loss'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-2 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Size</p>
                        <p className="text-sm">{amount} {marketName.split('/')[0]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Value</p>
                        <p className="text-sm">${(parseFloat(amount) * latestData.price).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Entry Price</p>
                        <p className="text-sm">${latestData.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Current Price</p>
                        <p className="text-sm">${latestData.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Unrealized P&L</p>
                        <p className={`text-sm ${isPriceUp ? 'text-green-600' : 'text-red-600'}`}>
                          {isPriceUp ? '+' : '-'}$0.00 (0.00%)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Leverage</p>
                        <p className="text-sm">{leverage}x</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-red-500 border-red-500">
                        Close Position
                      </Button>
                      <Button size="sm" variant="outline">
                        Adjust Stop Loss
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md bg-blue-50 p-3">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <h5 className="text-sm font-medium text-blue-700">Position Information</h5>
                        <p className="text-xs text-blue-600 mt-1">
                          This position was opened moments ago. Market movements will be reflected in your P&L shortly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You don't have any open positions for {marketName}</p>
                  <Button onClick={() => setCurrentTab("trade")}>Open a Position</Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
