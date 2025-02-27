
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MarketChartView } from "./MarketChartView";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, ExternalLink, MousePointer, TrendingDown, TrendingUp } from "lucide-react";
import { ChartData } from "./types";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { toast } from "../ui/use-toast";

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
  if (!marketName || !marketData.length) {
    return null;
  }

  const latestData = marketData[marketData.length - 1];
  const previousPrice = marketData.length > 1 ? marketData[marketData.length - 2].price : latestData.price;
  const isPriceUp = latestData.price > previousPrice;

  const handleBuyClick = () => {
    toast({
      title: "Order Placed",
      description: `Successfully placed a buy order for ${marketName}`,
    });
  };

  const handleSellClick = () => {
    toast({
      title: "Order Placed",
      description: `Successfully placed a sell order for ${marketName}`,
    });
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
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Analysis
            </Button>
          </DialogTitle>
          <DialogDescription>
            Detailed market information and trading options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <MarketChartView data={marketData} type="price" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-medium">Place Order</h3>
              
              <div className="space-y-2">
                <Label htmlFor="order-type">Order Type</Label>
                <Select defaultValue="market">
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
                <Input id="amount" type="number" placeholder="0.00" defaultValue="100" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leverage">Leverage</Label>
                <Select defaultValue="1">
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
                  <p className="text-sm text-muted-foreground">Open</p>
                  <p className="font-medium">${latestData.high.toFixed(2) || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Close</p>
                  <p className="font-medium">${latestData.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">High</p>
                  <p className="font-medium">${latestData.high.toFixed(2) || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Low</p>
                  <p className="font-medium">${latestData.low.toFixed(2) || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volume</p>
                  <p className="font-medium">${latestData.volume?.toLocaleString() || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">24h Change</p>
                  <p className={`font-medium ${isPriceUp ? "text-green-500" : "text-red-500"}`}>
                    {isPriceUp ? "+" : "-"}
                    {Math.abs(((latestData.price - previousPrice) / previousPrice) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <MousePointer className="h-4 w-4 mr-2" />
                  Open in Advanced Trading View
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
