
import React from 'react';
import { Button } from "@/components/ui/button";
import { DollarSign, ExternalLink } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="mt-6 space-y-4 max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <Label htmlFor="amount" className="w-24">Amount:</Label>
        <Input
          id="amount"
          type="text"
          value={amount}
          onChange={onAmountChange}
          className="w-full"
          placeholder="0.01"
        />
      </div>
      
      <div className="flex justify-center gap-4">
        <Button className="bg-green-500 hover:bg-green-600 flex-1" onClick={onBuyClick}>
          <DollarSign className="h-4 w-4 mr-2" />
          Buy
        </Button>
        <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50 flex-1" onClick={onSellClick}>
          <DollarSign className="h-4 w-4 mr-2" />
          Sell
        </Button>
        <Button variant="outline" onClick={onExternalClick}>
          <ExternalLink className="h-4 w-4 mr-2" />
          CoinGecko
        </Button>
      </div>
    </div>
  );
};
