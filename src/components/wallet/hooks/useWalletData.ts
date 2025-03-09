
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { WalletData, WalletType } from "../types/walletTypes";

export const useWalletData = () => {
  const [walletData, setWalletData] = useState<Record<WalletType, WalletData | null>>({
    crypto: null,
    fiat: null
  });
  const [activeWalletType, setActiveWalletType] = useState<WalletType>('crypto');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch wallet data
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        toast({
          title: "Error fetching wallet data",
          description: "Unable to load your wallet information. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
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

  return {
    walletData,
    activeWalletType,
    setActiveWalletType,
    isLoading,
    handleRefresh,
    currentWallet: walletData[activeWalletType]
  };
};
