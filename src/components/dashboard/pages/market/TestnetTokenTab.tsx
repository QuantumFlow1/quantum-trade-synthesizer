
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Coins, Shield, Lock } from "lucide-react";
import { TokenBalanceCard } from "./TokenBalanceCard";
import { TokenTradeForm } from "./TokenTradeForm";
import { WalletConnection } from "./WalletConnection";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const TestnetTokenTab = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("sepolia");
  const [securityScore, setSecurityScore] = useState<number>(0);
  
  const handleConnect = (address: string, network: string) => {
    setWalletAddress(address);
    setIsConnected(true);
    setSelectedNetwork(network);
    // Calculate initial security score based on network
    const networkScores: Record<string, number> = {
      "sepolia": 78,
      "goerli": 75,
      "mumbai": 72,
      "arbitrum-goerli": 80,
      "bsc-testnet": 70
    };
    setSecurityScore(networkScores[network] || 70);
  };
  
  const handleDisconnect = () => {
    setWalletAddress("");
    setIsConnected(false);
    setSecurityScore(0);
  };
  
  const getSecurityColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getSecurityLevel = (score: number) => {
    if (score >= 90) return "High";
    if (score >= 70) return "Good";
    if (score >= 40) return "Medium";
    return "Low";
  };
  
  return (
    <div className="space-y-6">
      {!isConnected ? (
        <Alert>
          <Coins className="h-4 w-4" />
          <AlertTitle>Connect your wallet securely</AlertTitle>
          <AlertDescription>
            Connect a Web3 wallet with enhanced security measures to interact with testnet tokens. 
            You'll be able to view balances and execute secure trades on various testnets.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="p-4 bg-secondary/10 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className={`h-5 w-5 ${getSecurityColor(securityScore)}`} />
              <h3 className="font-medium">Security Status</h3>
            </div>
            <div className={`text-sm font-medium ${getSecurityColor(securityScore)}`}>
              {getSecurityLevel(securityScore)} Security ({securityScore}/100)
            </div>
          </div>
          
          <Progress 
            value={securityScore} 
            max={100} 
            className="h-2 mb-2"
            indicatorClassName={`${
              securityScore >= 90 ? "bg-green-500" : 
              securityScore >= 70 ? "bg-blue-500" : 
              securityScore >= 40 ? "bg-yellow-500" : 
              "bg-red-500"
            }`}
          />
          
          <div className="grid grid-cols-3 gap-2 text-xs mt-2">
            <div className="flex flex-col items-center p-2 bg-secondary/20 rounded-md">
              <div className="text-muted-foreground mb-1">Network</div>
              <div className={getSecurityColor(securityScore)}>
                {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)} Testnet
              </div>
            </div>
            <div className="flex flex-col items-center p-2 bg-secondary/20 rounded-md">
              <div className="text-muted-foreground mb-1">Connection</div>
              <div className="text-green-500">Secure</div>
            </div>
            <div className="flex flex-col items-center p-2 bg-secondary/20 rounded-md">
              <div className="text-muted-foreground mb-1">Wallet</div>
              <div className="text-xs truncate max-w-[100px]">
                {walletAddress.substring(0, 4)}...{walletAddress.substring(walletAddress.length - 4)}
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <WalletConnection 
            onConnect={handleConnect} 
            onDisconnect={handleDisconnect} 
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TokenBalanceCard
              tokenSymbol="LOV"
              tokenName="Lovable Token"
              walletAddress={walletAddress}
              isConnected={isConnected}
              network={selectedNetwork}
            />
            
            <TokenBalanceCard
              tokenSymbol="TST"
              tokenName="Test Token"
              walletAddress={walletAddress}
              isConnected={isConnected}
              network={selectedNetwork}
            />
          </div>
        </div>
      </div>
      
      <TokenTradeForm
        tokenSymbol="LOV"
        isConnected={isConnected}
        walletAddress={walletAddress}
      />
      
      {isConnected && (
        <div className="text-xs text-muted-foreground p-3 bg-secondary/10 rounded-md border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-3 w-3" />
            <span className="font-medium">Security Information</span>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>All transactions are signed locally in your wallet</li>
            <li>Your private keys never leave your device</li>
            <li>Testnet tokens have no real value but use the same security protocols</li>
            <li>Set appropriate security levels for production use</li>
            <li>Consider using a hardware wallet for maximum security in production</li>
          </ul>
        </div>
      )}
    </div>
  );
};
