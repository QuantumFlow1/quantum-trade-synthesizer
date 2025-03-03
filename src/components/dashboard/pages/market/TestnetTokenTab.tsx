
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, Copy, ExternalLink, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const TestnetTokenTab: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("ethereum");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleNetworkChange = (network: string) => {
    setActiveTab(network);
  };

  const handleCopyFaucetLink = () => {
    navigator.clipboard.writeText(getFaucetLink(activeTab));
    setCopySuccess(true);
    toast({
      title: "Link copied!",
      description: "Faucet link copied to clipboard",
    });
    
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  const handleRequestTokens = () => {
    if (!walletAddress) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a wallet address",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success!",
        description: `Test tokens sent to ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`,
      });
    }, 2000);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
  };
  
  const getFaucetLink = (network: string): string => {
    const faucetLinks: Record<string, string> = {
      ethereum: "https://goerlifaucet.com/",
      polygon: "https://faucet.polygon.technology/",
      arbitrum: "https://faucet.arbitrum.io/",
      optimism: "https://faucet.quicknode.com/optimism/goerli",
      base: "https://faucet.base.org/",
    };
    
    return faucetLinks[network] || "#";
  };

  const handleAddToMetaMask = (address: string, network: string) => {
    // Implementation for adding token to MetaMask
    // This would typically use the window.ethereum provider
    console.log(`Adding token ${address} on ${network} to MetaMask`);
    
    toast({
      title: "MetaMask Action",
      description: `Adding test token to MetaMask on ${network}`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Testnet Token Faucet
          </CardTitle>
          <CardDescription>
            Request testnet tokens for development and testing on various networks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleNetworkChange} className="w-full">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
              <TabsTrigger value="polygon">Polygon</TabsTrigger>
              <TabsTrigger value="arbitrum">Arbitrum</TabsTrigger>
              <TabsTrigger value="optimism">Optimism</TabsTrigger>
              <TabsTrigger value="base">Base</TabsTrigger>
            </TabsList>
            
            {["ethereum", "polygon", "arbitrum", "optimism", "base"].map((network) => (
              <TabsContent key={network} value={network} className="space-y-4">
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="wallet-address" className="text-sm font-medium">
                      Your Wallet Address
                    </label>
                    <Input
                      id="wallet-address"
                      placeholder="0x..."
                      value={walletAddress}
                      onChange={handleAddressChange}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between bg-secondary/20 p-3 rounded-md">
                    <div>
                      <p className="text-sm font-medium">External Faucet</p>
                      <p className="text-xs text-muted-foreground">
                        Get additional tokens from the official {network.charAt(0).toUpperCase() + network.slice(1)} faucet
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyFaucetLink}
                        className="flex items-center gap-1"
                      >
                        {copySuccess ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        Copy Link
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(getFaucetLink(network), "_blank")}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full"
                    onClick={handleRequestTokens}
                    disabled={isLoading || !walletAddress}
                  >
                    {isLoading ? (
                      <>
                        <Skeleton className="h-4 w-4 rounded-full mr-2" />
                        Sending Tokens...
                      </>
                    ) : (
                      "Request Test Tokens"
                    )}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <p>
            Testnet tokens have no real value and are only for development and testing purposes.
          </p>
        </CardFooter>
      </Card>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Tokens</CardTitle>
            <CardDescription>Testnet tokens you can request</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getTestnetTokens(activeTab).map((token) => (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">{token.symbol.substring(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{token.name}</p>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {token.symbol}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddToMetaMask(token.address, activeTab)}
                    className="flex items-center gap-1"
                  >
                    <span className="text-xs">Add</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Network Details</CardTitle>
            <CardDescription>Configuration for {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} testnet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Network Name</p>
                <p className="font-medium">{getNetworkInfo(activeTab).name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RPC URL</p>
                <p className="font-medium truncate">{getNetworkInfo(activeTab).rpcUrl}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chain ID</p>
                <p className="font-medium">{getNetworkInfo(activeTab).chainId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currency Symbol</p>
                <p className="font-medium">{getNetworkInfo(activeTab).symbol}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Block Explorer</p>
                <a
                  href={getNetworkInfo(activeTab).blockExplorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium flex items-center gap-1"
                >
                  {getNetworkInfo(activeTab).blockExplorer.replace("https://", "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper functions to provide network-specific data
const getTestnetTokens = (network: string) => {
  const tokens: Record<string, Array<{ name: string; symbol: string; address: string }>> = {
    ethereum: [
      { name: "Goerli ETH", symbol: "gETH", address: "0x0000000000000000000000000000000000000000" },
      { name: "Test USDC", symbol: "tUSDC", address: "0x07865c6e87b9f70255377e024ace6630c1eaa37f" },
      { name: "Test DAI", symbol: "tDAI", address: "0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844" },
    ],
    polygon: [
      { name: "Mumbai MATIC", symbol: "MATIC", address: "0x0000000000000000000000000000000000001010" },
      { name: "Test USDT", symbol: "tUSDT", address: "0x3813e82e6f7098b9583fc0f33a962d02018b6803" },
    ],
    arbitrum: [
      { name: "Arbitrum ETH", symbol: "aETH", address: "0x0000000000000000000000000000000000000000" },
      { name: "Test USDC", symbol: "tUSDC", address: "0xfd064a18f3bf249cf1f87fc203e90d8f650f2d63" },
    ],
    optimism: [
      { name: "Optimism ETH", symbol: "oETH", address: "0x0000000000000000000000000000000000000000" },
      { name: "Test USDC", symbol: "tUSDC", address: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b" },
    ],
    base: [
      { name: "Base ETH", symbol: "bETH", address: "0x0000000000000000000000000000000000000000" },
      { name: "Test USDC", symbol: "tUSDC", address: "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca" },
    ],
  };
  
  return tokens[network] || [];
};

const getNetworkInfo = (network: string) => {
  const networkInfo: Record<string, { name: string; rpcUrl: string; chainId: number; symbol: string; blockExplorer: string }> = {
    ethereum: {
      name: "Goerli Testnet",
      rpcUrl: "https://goerli.infura.io/v3/your-api-key",
      chainId: 5,
      symbol: "ETH",
      blockExplorer: "https://goerli.etherscan.io",
    },
    polygon: {
      name: "Mumbai Testnet",
      rpcUrl: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      symbol: "MATIC",
      blockExplorer: "https://mumbai.polygonscan.com",
    },
    arbitrum: {
      name: "Arbitrum Goerli",
      rpcUrl: "https://goerli-rollup.arbitrum.io/rpc",
      chainId: 421613,
      symbol: "ETH",
      blockExplorer: "https://goerli.arbiscan.io",
    },
    optimism: {
      name: "Optimism Goerli",
      rpcUrl: "https://goerli.optimism.io",
      chainId: 420,
      symbol: "ETH",
      blockExplorer: "https://goerli-optimism.etherscan.io",
    },
    base: {
      name: "Base Goerli",
      rpcUrl: "https://goerli.base.org",
      chainId: 84531,
      symbol: "ETH",
      blockExplorer: "https://goerli.basescan.org",
    },
  };
  
  return networkInfo[network] || networkInfo.ethereum;
};
