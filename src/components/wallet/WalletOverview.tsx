
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Wallet, CreditCard, Bitcoin } from "lucide-react";
import { WalletHeader } from "./overview/WalletHeader";
import { WalletBalanceCards } from "./overview/WalletBalanceCards";
import { WalletPerformance } from "./overview/WalletPerformance";
import { WalletAssetAllocation } from "./overview/WalletAssetAllocation";
import { WalletBalanceHistory } from "./overview/WalletBalanceHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WalletOverviewProps {
  onDisconnect: () => void;
}

export type WalletType = 'crypto' | 'fiat';

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
  type: WalletType;
}

export const WalletOverview = ({ onDisconnect }: WalletOverviewProps) => {
  const [walletData, setWalletData] = useState<Record<WalletType, WalletData | null>>({
    crypto: null,
    fiat: null
  });
  const [activeWalletType, setActiveWalletType] = useState<WalletType>('crypto');
  const { toast } = useToast();

  // Simulate fetching wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock wallet data for crypto
        const mockCryptoWallet: WalletData = {
          address: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
          balance: 12453.78,
          availableBalance: 10200.50,
          lockedBalance: 2253.28,
          currency: "$",
          lastUpdated: new Date(),
          performanceToday: 2.34,
          performanceWeek: -1.2,
          performanceMonth: 8.5,
          type: 'crypto'
        };
        
        // Mock wallet data for fiat
        const mockFiatWallet: WalletData = {
          address: "US-87654321-ACCT",
          balance: 5680.42,
          availableBalance: 5680.42,
          lockedBalance: 0,
          currency: "$",
          lastUpdated: new Date(),
          performanceToday: 0.01,
          performanceWeek: 0.04,
          performanceMonth: 0.15,
          type: 'fiat'
        };
        
        setWalletData({
          crypto: mockCryptoWallet,
          fiat: mockFiatWallet
        });
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
      const currentWallet = walletData[activeWalletType];
      
      if (currentWallet) {
        const updatedWallet = {
          ...currentWallet,
          balance: currentWallet.balance + (Math.random() * 100 - 50),
          availableBalance: currentWallet.availableBalance + (Math.random() * 50 - 25),
          lastUpdated: new Date(),
          performanceToday: currentWallet.performanceToday + (Math.random() * 0.5 - 0.25),
        };
        
        setWalletData(prev => ({
          ...prev,
          [activeWalletType]: updatedWallet
        }));
        
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

  // Generate mock balance history data based on wallet type
  const getBalanceHistoryData = (type: WalletType) => {
    const now = new Date();
    const data = [];
    const baseBalance = type === 'crypto' ? 12000 : 5500;
    
    // Generate data for the last 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Create some random fluctuation
      const fluctuation = (Math.random() * 2 - 1) * (type === 'crypto' ? 500 : 100);
      const dayBalance = baseBalance + fluctuation * (30 - i) / 10;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: dayBalance
      });
    }
    
    return data;
  };

  const currentWallet = walletData[activeWalletType];
  const isLoading = !walletData.crypto || !walletData.fiat;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs 
        value={activeWalletType} 
        onValueChange={(value) => setActiveWalletType(value as WalletType)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
          <TabsTrigger value="crypto" className="flex items-center gap-2">
            <Bitcoin className="h-4 w-4" />
            Crypto Wallet
          </TabsTrigger>
          <TabsTrigger value="fiat" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Fiat Wallet
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="crypto" className="space-y-6">
          {currentWallet && activeWalletType === 'crypto' && renderWalletContent(currentWallet)}
        </TabsContent>
        
        <TabsContent value="fiat" className="space-y-6">
          {currentWallet && activeWalletType === 'fiat' && renderWalletContent(currentWallet)}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  function renderWalletContent(wallet: WalletData) {
    return (
      <>
        <WalletHeader 
          address={wallet.address}
          lastUpdated={wallet.lastUpdated}
          onRefresh={handleRefresh}
          onDisconnect={onDisconnect}
          walletType={wallet.type}
        />
        
        <WalletBalanceCards 
          balance={wallet.balance}
          availableBalance={wallet.availableBalance}
          lockedBalance={wallet.lockedBalance}
          performanceToday={wallet.performanceToday}
          currency={wallet.currency}
          walletType={wallet.type}
        />
        
        <WalletPerformance 
          performanceToday={wallet.performanceToday}
          performanceWeek={wallet.performanceWeek}
          performanceMonth={wallet.performanceMonth}
        />
        
        <WalletBalanceHistory 
          data={getBalanceHistoryData(wallet.type)}
        />
        
        <WalletAssetAllocation walletType={wallet.type} />
      </>
    );
  }
};
