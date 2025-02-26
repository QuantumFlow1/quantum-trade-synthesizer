
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, ExternalLink, RefreshCw, Shield, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { TokenData } from "@/components/market/types";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [isVerified, setIsVerified] = useState<boolean>(true);

  const fetchBalance = async () => {
    if (!isConnected || !walletAddress) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would use ethers.js to call the token contract
      // with proper error handling and security checks
      setTimeout(() => {
        // Generate random balance with proper formatting for the demo
        const mockBalance = (Math.random() * 100).toFixed(4);
        setBalance(mockBalance);
        
        // Simulate token verification check
        const mockVerified = Math.random() > 0.2; // 80% chance of being verified
        setIsVerified(mockVerified);
        
        // Calculate mock security score based on network, verification
        const baseScore = network === "mainnet" ? 60 : 70;
        const verificationBonus = mockVerified ? 30 : 0;
        setSecurityScore(baseScore + verificationBonus);
        
        // Mock token data
        setTokenData({
          symbol: tokenSymbol,
          name: tokenName,
          balance: mockBalance,
          network: network,
          address: "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
          verified: mockVerified,
          decimals: 18,
          tokenType: "ERC20"
        });
        
        setLastUpdated(new Date());
        setIsLoading(false);
        
        // Log fetch for security auditing
        console.log(`Token balance fetched at ${new Date().toISOString()} for ${tokenSymbol}`);
      }, 1000);
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setIsLoading(false);
    }
  };

  // Auto-refresh balance every 30 seconds if connected
  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchBalance();
      
      const intervalId = setInterval(() => {
        fetchBalance();
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [isConnected, walletAddress, network]);

  const getSecurityColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="p-4 bg-secondary/20 backdrop-blur-xl border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          <h3 className="font-medium">{tokenName}</h3>
          
          {tokenData && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    {tokenData.verified ? (
                      <Badge variant="outline" className="ml-1 bg-green-500/20 text-green-400 text-xs">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="ml-1 bg-yellow-500/20 text-yellow-400 text-xs">Unverified</Badge>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {tokenData.verified 
                    ? "This token contract has been verified and audited" 
                    : "This token contract has not been verified - exercise caution"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
        
        {tokenData && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Security:</span>
            <span className={`text-sm font-medium ${getSecurityColor(securityScore)}`}>
              {securityScore}/100
            </span>
          </div>
        )}
        
        {lastUpdated && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Last Updated:</span>
            <span className="text-xs">
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
      
      {network && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <a 
              href={`https://${network}.etherscan.io/address/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              View on Etherscan
            </a>
            
            {tokenData && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-xs">
                      <Shield className={`h-3 w-3 ${getSecurityColor(securityScore)}`} />
                      <span className={getSecurityColor(securityScore)}>
                        {securityScore >= 90 ? "High Security" : 
                         securityScore >= 70 ? "Good Security" : 
                         securityScore >= 40 ? "Medium Security" : "Low Security"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p>Security analysis of this token:</p>
                      <ul className="mt-1 list-disc pl-3">
                        <li>Contract verification: {tokenData.verified ? "✓" : "✗"}</li>
                        <li>Network security: {network === "mainnet" ? "High" : "Testnet"}</li>
                        <li>Token standard: {tokenData.tokenType || "Unknown"}</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
