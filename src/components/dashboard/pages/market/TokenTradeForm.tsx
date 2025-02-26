
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface TokenTradeFormProps {
  tokenSymbol: string;
  isConnected: boolean;
  walletAddress?: string;
}

export const TokenTradeForm = ({
  tokenSymbol,
  isConnected,
  walletAddress,
}: TokenTradeFormProps) => {
  const [amount, setAmount] = useState<string>("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to execute trades",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulating blockchain transaction
      // In a real implementation, this would use ethers.js to interact with the token contract
      setTimeout(() => {
        toast({
          title: "Transaction Submitted",
          description: `${tradeType === "buy" ? "Bought" : "Sold"} ${amount} ${tokenSymbol} successfully!`,
        });
        setAmount("");
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error("Error executing trade:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to execute the transaction. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-4 bg-secondary/20 backdrop-blur-xl border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        {tradeType === "buy" ? (
          <ArrowUpCircle className="h-5 w-5 text-green-500" />
        ) : (
          <ArrowDownCircle className="h-5 w-5 text-red-500" />
        )}
        <h3 className="font-medium">Trade {tokenSymbol} Tokens</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Trade Type</Label>
          <RadioGroup
            value={tradeType}
            onValueChange={(value) => setTradeType(value as "buy" | "sell")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buy" id="buy" />
              <Label htmlFor="buy" className="flex items-center space-x-2 cursor-pointer">
                <ArrowUpCircle className="w-4 h-4 text-green-500" />
                <span>Buy</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sell" id="sell" />
              <Label htmlFor="sell" className="flex items-center space-x-2 cursor-pointer">
                <ArrowDownCircle className="w-4 h-4 text-red-500" />
                <span>Sell</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Enter ${tokenSymbol} amount...`}
            disabled={!isConnected || isProcessing}
            className="bg-background/50"
          />
        </div>
        
        <Button
          type="submit"
          className={`w-full ${
            tradeType === "buy" 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-red-500 hover:bg-red-600"
          }`}
          disabled={!isConnected || isProcessing}
        >
          {isProcessing ? (
            "Processing..."
          ) : (
            `${tradeType === "buy" ? "Buy" : "Sell"} ${tokenSymbol}`
          )}
        </Button>
        
        {!isConnected && (
          <div className="text-center text-sm text-muted-foreground">
            <Wallet className="h-4 w-4 mx-auto mb-2" />
            Connect wallet to trade tokens
          </div>
        )}
      </form>
    </Card>
  );
};
