
import { useState } from "react";
import { MarketHeader } from "./market/MarketHeader";
import { MarketTabs } from "./market/MarketTabs";
import { MarketDataTable } from "./market/MarketDataTable";
import { TestnetTokenTab } from "./market/TestnetTokenTab";
import { WalletConnection } from "./market/WalletConnection";
import { useMarketData } from "./market/useMarketData";
import { EnhancedMarketTab } from "./market/EnhancedMarketTab";

export const MarketPage = () => {
  const [activeTab, setActiveTab] = useState("coins");
  const [walletConnected, setWalletConnected] = useState(false);
  const { marketData, isLoading, filterValue, setFilterValue, error } = useMarketData();

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  return (
    <div className="space-y-6">
      <MarketHeader 
        filterValue={filterValue} 
        setFilterValue={setFilterValue} 
        isLoading={isLoading}
      />

      <MarketTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "coins" && (
        <MarketDataTable 
          marketData={marketData} 
          isLoading={isLoading} 
          error={error}
        />
      )}

      {activeTab === "enhanced" && (
        <EnhancedMarketTab />
      )}

      {activeTab === "tokens" && (
        walletConnected ? (
          <div>
            <p className="text-center text-gray-500 py-10">
              Coming soon: Your token balances will appear here
            </p>
          </div>
        ) : (
          <WalletConnection onConnect={handleConnectWallet} />
        )
      )}

      {activeTab === "testnet" && <TestnetTokenTab />}
    </div>
  );
};
