
import { WalletHeader } from "./overview/WalletHeader";
import { WalletBalanceCards } from "./overview/WalletBalanceCards";
import { WalletPerformance } from "./overview/WalletPerformance";
import { WalletAssetAllocation } from "./overview/WalletAssetAllocation";
import { WalletBalanceHistory } from "./overview/WalletBalanceHistory";
import { WalletLoading } from "./overview/WalletLoading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bitcoin, CreditCard } from "lucide-react";
import { useWalletData } from "./hooks/useWalletData";
import { WalletType, WalletData } from "./types/walletTypes";

interface WalletOverviewProps {
  onDisconnect: () => void;
}

export const WalletOverview = ({ onDisconnect }: WalletOverviewProps) => {
  const { 
    walletData, 
    activeWalletType, 
    setActiveWalletType, 
    isLoading, 
    handleRefresh,
    currentWallet 
  } = useWalletData();

  if (isLoading) {
    return <WalletLoading />;
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
          currency={wallet.currency}
          walletType={wallet.type}
        />
        
        <WalletAssetAllocation walletType={wallet.type} />
      </>
    );
  }
};
