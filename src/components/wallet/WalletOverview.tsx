
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCw, LogOut, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface WalletOverviewProps {
  onDisconnect: () => void;
}

interface WalletData {
  address: string;
  balance: number;
  availableBalance: number;
  lockedBalance: number;
  currency: string;
  lastUpdated: Date;
  performanceToday: number;
  performanceWeek: number;
  performanceMonth: number;
}

export const WalletOverview = ({ onDisconnect }: WalletOverviewProps) => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { toast } = useToast();

  // Simulate fetching wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock wallet data
        const mockWalletData: WalletData = {
          address: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
          balance: 12453.78,
          availableBalance: 10200.50,
          lockedBalance: 2253.28,
          currency: "USD",
          lastUpdated: new Date(),
          performanceToday: 2.34,
          performanceWeek: -1.2,
          performanceMonth: 8.5,
        };
        
        setWalletData(mockWalletData);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        toast({
          title: "Error fetching wallet data",
          description: "Unable to load your wallet information. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchWalletData();
  }, [toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Update with slightly different mock data
      if (walletData) {
        const updatedWalletData = {
          ...walletData,
          balance: walletData.balance + (Math.random() * 100 - 50),
          availableBalance: walletData.availableBalance + (Math.random() * 50 - 25),
          lastUpdated: new Date(),
          performanceToday: walletData.performanceToday + (Math.random() * 0.5 - 0.25),
        };
        
        setWalletData(updatedWalletData);
        
        toast({
          title: "Wallet Refreshed",
          description: "Your wallet information has been updated",
        });
      }
    } catch (error) {
      console.error("Error refreshing wallet data:", error);
      toast({
        title: "Error refreshing wallet",
        description: "Unable to refresh your wallet information. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!walletData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        {/* Wallet Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">Wallet Address:</div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm">{formatAddress(walletData.address)}</span>
              <button 
                onClick={() => copyToClipboard(walletData.address)}
                className="p-1 rounded-full hover:bg-secondary/50"
                aria-label="Copy wallet address"
              >
                <Copy className="h-3 w-3" />
              </button>
              <a 
                href={`https://etherscan.io/address/${walletData.address}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1 rounded-full hover:bg-secondary/50"
                aria-label="View on blockchain explorer"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: {walletData.lastUpdated.toLocaleTimeString()}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDisconnect}
            className="text-xs text-destructive hover:text-destructive"
          >
            <LogOut className="h-3 w-3 mr-1" />
            Disconnect
          </Button>
        </div>
      </div>
      
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
          <div className="text-sm text-muted-foreground">Total Balance</div>
          <div className="text-2xl font-bold">${walletData.balance.toLocaleString()}</div>
          <div className="mt-2 flex items-center">
            <div className={`text-xs flex items-center ${walletData.performanceToday >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {walletData.performanceToday >= 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {Math.abs(walletData.performanceToday).toFixed(2)}% today
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
          <div className="text-sm text-muted-foreground">Available Balance</div>
          <div className="text-2xl font-bold">${walletData.availableBalance.toLocaleString()}</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Available for trading
          </div>
        </Card>
        
        <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
          <div className="text-sm text-muted-foreground">Locked Balance</div>
          <div className="text-2xl font-bold">${walletData.lockedBalance.toLocaleString()}</div>
          <div className="mt-2 text-xs text-muted-foreground">
            In active trades/orders
          </div>
        </Card>
      </div>
      
      {/* Performance */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Performance</h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Today</span>
              <span className={walletData.performanceToday >= 0 ? 'text-green-500' : 'text-red-500'}>
                {walletData.performanceToday > 0 ? '+' : ''}{walletData.performanceToday.toFixed(2)}%
              </span>
            </div>
            <Progress 
              value={50 + (walletData.performanceToday * 5)} 
              className="h-2" 
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>This Week</span>
              <span className={walletData.performanceWeek >= 0 ? 'text-green-500' : 'text-red-500'}>
                {walletData.performanceWeek > 0 ? '+' : ''}{walletData.performanceWeek.toFixed(2)}%
              </span>
            </div>
            <Progress 
              value={50 + (walletData.performanceWeek * 5)} 
              className="h-2" 
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>This Month</span>
              <span className={walletData.performanceMonth >= 0 ? 'text-green-500' : 'text-red-500'}>
                {walletData.performanceMonth > 0 ? '+' : ''}{walletData.performanceMonth.toFixed(2)}%
              </span>
            </div>
            <Progress 
              value={50 + (walletData.performanceMonth * 2)} 
              className="h-2" 
            />
          </div>
        </div>
      </div>
      
      {/* Asset Allocation */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Asset Allocation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-secondary/20 rounded-md">
            <div className="text-sm font-medium">BTC</div>
            <div className="text-lg font-bold">45%</div>
          </div>
          <div className="p-3 bg-secondary/20 rounded-md">
            <div className="text-sm font-medium">ETH</div>
            <div className="text-lg font-bold">30%</div>
          </div>
          <div className="p-3 bg-secondary/20 rounded-md">
            <div className="text-sm font-medium">USDT</div>
            <div className="text-lg font-bold">15%</div>
          </div>
          <div className="p-3 bg-secondary/20 rounded-md">
            <div className="text-sm font-medium">Others</div>
            <div className="text-lg font-bold">10%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
