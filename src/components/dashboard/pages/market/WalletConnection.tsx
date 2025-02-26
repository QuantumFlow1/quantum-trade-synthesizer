
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Link as LinkIcon, Check, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectionProps {
  onConnect: (address: string, network: string) => void;
  onDisconnect: () => void;
}

export const WalletConnection = ({ onConnect, onDisconnect }: WalletConnectionProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("sepolia");
  const { toast } = useToast();

  // Simulates checking for previously connected wallet
  useEffect(() => {
    const savedWallet = localStorage.getItem("connectedWallet");
    const savedNetwork = localStorage.getItem("selectedNetwork");
    
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
      setSelectedNetwork(savedNetwork || "sepolia");
      onConnect(savedWallet, savedNetwork || "sepolia");
    }
  }, [onConnect]);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection
      // In a real implementation, this would use ethers.js or Web3Modal to connect to MetaMask or other wallets
      setTimeout(() => {
        const mockAddress = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
        setWalletAddress(mockAddress);
        setIsConnected(true);
        localStorage.setItem("connectedWallet", mockAddress);
        localStorage.setItem("selectedNetwork", selectedNetwork);
        onConnect(mockAddress, selectedNetwork);
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to wallet",
        });
        
        setIsConnecting(false);
      }, 1500);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsConnected(false);
    localStorage.removeItem("connectedWallet");
    localStorage.removeItem("selectedNetwork");
    onDisconnect();
    
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from wallet",
    });
  };

  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
    
    if (isConnected) {
      localStorage.setItem("selectedNetwork", network);
      onConnect(walletAddress, network);
      
      toast({
        title: "Network Changed",
        description: `Switched to ${network.charAt(0).toUpperCase() + network.slice(1)} testnet`,
      });
    }
  };

  return (
    <Card className="p-4 bg-secondary/20 backdrop-blur-xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Wallet Connection</h3>
        </div>
        
        {isConnected ? (
          <div className="flex items-center gap-1 text-xs text-green-500">
            <Check className="h-3 w-3" />
            <span>Connected</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-yellow-500">
            <AlertTriangle className="h-3 w-3" />
            <span>Not Connected</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Testnet Network</label>
          <Select
            value={selectedNetwork}
            onValueChange={handleNetworkChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sepolia">Ethereum Sepolia</SelectItem>
              <SelectItem value="goerli">Ethereum Goerli</SelectItem>
              <SelectItem value="bsc-testnet">BSC Testnet</SelectItem>
              <SelectItem value="mumbai">Polygon Mumbai</SelectItem>
              <SelectItem value="arbitrum-goerli">Arbitrum Goerli</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Address:</span>
              <span className="text-xs font-mono">
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <a
                href={`https://${selectedNetwork}.etherscan.io/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 text-primary hover:underline"
              >
                <LinkIcon className="h-3 w-3" />
                View on Explorer
              </a>
              
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectWallet}
                className="text-xs"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>
    </Card>
  );
};
