
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';
import { MarketData } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TradeConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tradeType: "buy" | "sell";
  amount: string;
  marketData: MarketData;
}

export const TradeConfirmationDialog: React.FC<TradeConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  tradeType,
  amount,
  marketData
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Confirm {tradeType === "buy" ? "Buy" : "Sell"} Order</DialogTitle>
          <DialogDescription>
            You are about to {tradeType === "buy" ? "buy" : "sell"} {amount} {marketData.symbol.split('/')[0]} at approximately ${marketData.price.toFixed(2)}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-muted-foreground">
              Trading cryptocurrencies involves risk. Only trade with funds you can afford to lose.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">Amount:</p>
              <p>{amount} {marketData.symbol.split('/')[0]}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Estimated Value:</p>
              <p>${(parseFloat(amount) * marketData.price).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Price:</p>
              <p>${marketData.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Order Type:</p>
              <p>Market {tradeType === "buy" ? "Buy" : "Sell"}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-center gap-4 sm:justify-center">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className={tradeType === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
          >
            Confirm {tradeType === "buy" ? "Buy" : "Sell"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
