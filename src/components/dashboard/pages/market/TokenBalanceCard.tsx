
import { Button } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { Coins, ExternalLink, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface TokenBalanceCardProps {
  tokenSymbol: string;
  tokenName: string;
  walletAddress?: string;
  isConnected: boolean;
  network: string;
}

export const TokenBalanceCard = ({
  tokenSymbol,
  tokenName,
  walletAddress,
  isConnected,
  network,
}: TokenBalanceCardProps) => {
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBalance = async () => {
    if (!isConnected || !walletAddress) return;
    
    setIsLoading(true);
    try {
      // Simulating API call to fetch token balance
      // In a real implementation, this would use ethers.js to call the token contract
      setTimeout(() => {
        const mockBalance = (Math.random() * 100).toFixed(4);
        setBalance(mockBalance);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchBalance();
    }
  }, [isConnected, walletAddress]);

  return (
    <Card className="p-4 bg-secondary/20 backdrop-blur-xl border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          <h3 className="font-medium">{tokenName}</h3>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={fetchBalance}
          disabled={!isConnected || isLoading}
          className="flex items-center gap-1 text-xs"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Balance:</span>
          <span className="font-medium">
            {isLoading ? "Loading..." : `${balance} ${tokenSymbol}`}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Network:</span>
          <span className="font-medium">{network}</span>
        </div>
        
        {walletAddress && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Wallet:</span>
            <span className="text-xs truncate max-w-[150px]">
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </span>
          </div>
        )}
      </div>
      
      {network && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <a 
            href={`https://${network}.etherscan.io/address/${walletAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View on Etherscan
          </a>
        </div>
      )}
    </Card>
  );
};
