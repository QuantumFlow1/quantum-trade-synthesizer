
import React from 'react';
import { Button } from "@/components/ui/button";
import { DollarSign, ExternalLink, Info } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TradeFormProps {
  amount: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBuyClick: () => void;
  onSellClick: () => void;
  onExternalClick: () => void;
}

export const TradeForm: React.FC<TradeFormProps> = ({
  amount,
  onAmountChange,
  onBuyClick,
  onSellClick,
  onExternalClick
}) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="amount" className="w-24">Amount:</Label>
        <div className="relative w-full">
          <Input
            id="amount"
            type="text"
            value={amount}
            onChange={onAmountChange}
            className="w-full pr-10"
            placeholder="0.01"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-help">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Trading guide: Start with small amounts (0.01-0.05) for safer trading.
                  Never risk more than 2% of your portfolio on a single trade.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600" onClick={onBuyClick}>
                <DollarSign className="h-4 w-4 mr-2" />
                Buy
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Buy when indicators show upward trend. Consider RSI values below 30.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50" onClick={onSellClick}>
                <DollarSign className="h-4 w-4 mr-2" />
                Sell
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sell when indicators show downward trend. Consider RSI values above 70.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button variant="outline" onClick={onExternalClick}>
          <ExternalLink className="h-4 w-4 mr-2" />
          CoinGecko
        </Button>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-600">
        <p className="font-medium">Trading Guide:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Always set stop losses to protect your investment</li>
          <li>Take profits at predefined targets</li>
          <li>Monitor market volatility before trading</li>
        </ul>
      </div>
    </div>
  );
};
