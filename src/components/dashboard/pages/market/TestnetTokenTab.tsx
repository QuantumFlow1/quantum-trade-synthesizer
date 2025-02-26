
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Coins } from "lucide-react";
import { TokenBalanceCard } from "./TokenBalanceCard";
import { TokenTradeForm } from "./TokenTradeForm";
import { WalletConnection } from "./WalletConnection";

export const TestnetTokenTab = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("sepolia");
  
  const handleConnect = (address: string, network: string) => {
    setWalletAddress(address);
    setIsConnected(true);
    setSelectedNetwork(network);
  };
  
  const handleDisconnect = () => {
    setWalletAddress("");
    setIsConnected(false);
  };
  
  return (
    <div className="space-y-6">
      {!isConnected && (
        <Alert>
          <Coins className="h-4 w-4" />
          <AlertTitle>Connect your wallet</AlertTitle>
          <AlertDescription>
            Connect a Web3 wallet to interact with testnet tokens. You'll be able to view balances and execute trades on various testnets.
          </AlertDescription>
        </Alert>
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
    </div>
  );
};
