
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowUp, ArrowDown, MousePointer, Shield, TrendingUp } from 'lucide-react';
import { ChartData, MarketData } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface TradeTabContentProps {
  marketData: MarketData;
  marketName: string | null;
  amount: string;
  setAmount: (value: string) => void;
  leverage: string;
  setLeverage: (value: string) => void;
  orderType: string;
  setOrderType: (value: string) => void;
  latestData: ChartData;
  isPriceUp: boolean;
  change24h: number;
  handleBuyClick: () => void;
  handleSellClick: () => void;
  stopLoss: string;
  setStopLoss: (value: string) => void;
  takeProfit: string;
  setTakeProfit: (value: string) => void;
  advancedOptions: boolean;
  setAdvancedOptions: (value: boolean) => void;
}

export const TradeTabContent = ({ 
  marketData,
  marketName,
  amount,
  setAmount,
  leverage,
  setLeverage,
  orderType,
  setOrderType,
  latestData,
  isPriceUp,
  change24h,
  handleBuyClick,
  handleSellClick,
  stopLoss,
  setStopLoss,
  takeProfit,
  setTakeProfit,
  advancedOptions,
  setAdvancedOptions
}: TradeTabContentProps) => {
  // Calculate the default stop loss and take profit values based on current price
  const defaultStopLoss = (latestData.price * 0.95).toFixed(2);
  const defaultTakeProfit = (latestData.price * 1.05).toFixed(2);
  
  return (
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
          <Switch 
            id="advanced-options" 
            checked={advancedOptions} 
            onCheckedChange={setAdvancedOptions} 
          />
          <Label htmlFor="advanced-options">Enable advanced options</Label>
        </div>
        
        {advancedOptions && (
          <div className="space-y-4 p-3 bg-secondary/20 rounded border border-border">
            <h4 className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Risk Management
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="stop-loss">Stop Loss</Label>
              <Input 
                id="stop-loss" 
                type="number" 
                placeholder={defaultStopLoss} 
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Price at which your position will automatically close to limit losses
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="take-profit">Take Profit</Label>
              <Input 
                id="take-profit" 
                type="number" 
                placeholder={defaultTakeProfit} 
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Price at which your position will automatically close to secure profits
              </p>
            </div>
          </div>
        )}
        
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
        
        <div className="grid grid-cols-2 gap-y-2 mb-3">
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
            <p className="font-medium">${formatCurrency(marketData.high24h)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">24h Low</p>
            <p className="font-medium">${formatCurrency(marketData.low24h)}</p>
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

        <Separator />
        
        <div>
          <h4 className="text-sm font-medium flex items-center mb-2">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance Projection
          </h4>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">Potential Profit (1d)</p>
              <p className="text-green-500 font-medium">
                +{(Math.abs(change24h) * 1.2).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Potential Loss (1d)</p>
              <p className="text-red-500 font-medium">
                -{(Math.abs(change24h) * 0.8).toFixed(2)}%
              </p>
            </div>
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
  );
};
