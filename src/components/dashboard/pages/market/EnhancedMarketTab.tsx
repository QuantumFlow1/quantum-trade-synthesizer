
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketDataTable } from './enhanced/MarketDataTable';
import { MarketChart } from './enhanced/MarketChart';
import { MarketAnalysisCard } from './enhanced/MarketAnalysisCard';
import { MarketPositionsPage } from './positions/MarketPositionsPage';
import { MarketTransactionsPage } from './transactions/MarketTransactionsPage';

interface EnhancedMarketTabProps {
  marketData: any[];
  isLoading: boolean;
}

export const EnhancedMarketTab: React.FC<EnhancedMarketTabProps> = ({ marketData, isLoading }) => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [currentPositionsPage, setCurrentPositionsPage] = useState(1);
  const [currentTransactionsPage, setCurrentTransactionsPage] = useState(1);
  const itemsPerPage = 5;

  const handleAssetSelect = (symbol: string) => {
    setSelectedAsset(symbol);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketChart selectedAsset={selectedAsset} />
        </div>
        <div>
          <MarketAnalysisCard marketData={marketData} isLoading={isLoading} />
        </div>
      </div>

      <Tabs defaultValue="market-data">
        <TabsList className="mb-2">
          <TabsTrigger value="market-data">Market Data</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="market-data" className="mt-0">
          <MarketDataTable 
            data={marketData}
            isLoading={isLoading}
            onAssetSelect={handleAssetSelect}
          />
        </TabsContent>
        <TabsContent value="positions" className="mt-0">
          <MarketPositionsPage
            currentPage={currentPositionsPage}
            itemsPerPage={itemsPerPage}
            onNextPage={() => setCurrentPositionsPage(prev => prev + 1)}
            onPreviousPage={() => setCurrentPositionsPage(prev => Math.max(1, prev - 1))}
          />
        </TabsContent>
        <TabsContent value="transactions" className="mt-0">
          <MarketTransactionsPage
            currentPage={currentTransactionsPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentTransactionsPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
