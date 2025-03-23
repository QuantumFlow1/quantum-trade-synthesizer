
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreditCard, PieChart, LineChart } from "lucide-react";
import { EnhancedMarketTab } from "./EnhancedMarketTab";
import { TestnetTokenTab } from "./TestnetTokenTab";
import { WalletConnection } from "./WalletConnection";

interface MarketTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  marketData: any[];
  isLoading: boolean;
  walletConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const MarketTabs = ({ 
  activeTab, 
  onTabChange, 
  marketData, 
  isLoading, 
  walletConnected,
  onConnect,
  onDisconnect
}: MarketTabsProps) => {
  const handleTabClick = (tab: string) => {
    console.log("Tab selected:", tab);
    onTabChange(tab);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabClick} className="mb-6">
      <TabsList className="grid grid-cols-3 bg-secondary/20 backdrop-blur-sm p-1 rounded-lg">
        <TabsTrigger 
          value="enhanced" 
          className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg"
        >
          <LineChart className="h-4 w-4" />
          <span className="hidden sm:inline">Market Data</span>
          <span className="sm:hidden">Markets</span>
        </TabsTrigger>
        <TabsTrigger 
          value="tokens" 
          className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg"
        >
          <PieChart className="h-4 w-4" />
          <span className="hidden sm:inline">My Portfolio</span>
          <span className="sm:hidden">Portfolio</span>
        </TabsTrigger>
        <TabsTrigger 
          value="testnet" 
          className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg"
        >
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Testnet</span>
          <span className="sm:hidden">Test</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="enhanced">
        <EnhancedMarketTab marketData={marketData} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="tokens">
        {walletConnected ? (
          <div>
            <p className="text-center text-gray-500 py-10">
              Coming soon: Your token balances will appear here
            </p>
          </div>
        ) : (
          <WalletConnection 
            onConnect={onConnect}
            onDisconnect={onDisconnect}  
          />
        )}
      </TabsContent>
      
      <TabsContent value="testnet">
        <TestnetTokenTab />
      </TabsContent>
    </Tabs>
  );
};
