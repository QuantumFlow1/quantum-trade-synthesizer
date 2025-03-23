
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketDataTable } from './enhanced/MarketDataTable';
import { MarketAnalysisCard } from './enhanced/MarketAnalysisCard';
import { MarketPositionsPage } from './positions/MarketPositionsPage';
import { MarketTransactionsPage } from './transactions/MarketTransactionsPage';
import { LineChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Market Chart</h3>
                {selectedAsset && (
                  <div className="bg-accent/30 text-accent-foreground px-2 py-1 rounded text-sm">
                    {selectedAsset}
                  </div>
                )}
              </div>
              {!selectedAsset ? (
                <div className="flex flex-col items-center justify-center h-[300px] bg-secondary/20 rounded-md">
                  <LineChart className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Select an asset from the table below to view its chart</p>
                </div>
              ) : (
                <div className="h-[300px] bg-secondary/20 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Chart for {selectedAsset}</p>
                </div>
              )}
            </CardContent>
          </Card>
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
