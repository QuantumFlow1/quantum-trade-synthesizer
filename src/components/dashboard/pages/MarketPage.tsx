
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
  const { 
    marketData, 
    isLoading, 
    sortField,
    sortDirection,
    handleSortChange,
    error 
  } = useMarketData();

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
  };

  return (
    <div className="space-y-6">
      <MarketHeader isLoading={isLoading} />

      <MarketTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "coins" && (
        <MarketDataTable 
          data={marketData} 
          isLoading={isLoading} 
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
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
          <WalletConnection 
            onConnect={handleConnectWallet}
            onDisconnect={handleDisconnectWallet}  
          />
        )
      )}

      {activeTab === "testnet" && <TestnetTokenTab />}
    </div>
  );
};
