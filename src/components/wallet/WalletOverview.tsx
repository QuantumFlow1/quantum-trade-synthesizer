
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";
import { WalletHeader } from "./overview/WalletHeader";
import { WalletBalanceCards } from "./overview/WalletBalanceCards";
import { WalletPerformance } from "./overview/WalletPerformance";
import { WalletAssetAllocation } from "./overview/WalletAssetAllocation";

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
  const { toast } = useToast();

  // Simulate fetching wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock wallet data
        const mockWalletData: WalletData = {
          address: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
          balance: 12453.78,
          availableBalance: 10200.50,
          lockedBalance: 2253.28,
          currency: "$",
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
    }
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
      <WalletHeader 
        address={walletData.address}
        lastUpdated={walletData.lastUpdated}
        onRefresh={handleRefresh}
        onDisconnect={onDisconnect}
      />
      
      <WalletBalanceCards 
        balance={walletData.balance}
        availableBalance={walletData.availableBalance}
        lockedBalance={walletData.lockedBalance}
        performanceToday={walletData.performanceToday}
        currency={walletData.currency}
      />
      
      <WalletPerformance 
        performanceToday={walletData.performanceToday}
        performanceWeek={walletData.performanceWeek}
        performanceMonth={walletData.performanceMonth}
      />
      
      <WalletAssetAllocation />
    </div>
  );
};
