
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, CircleDollarSign, BarChart, TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketDataState } from './useMarketDataState';
import { MarketDataTable } from './MarketDataTable';
import { MarketTrendCards } from './MarketTrendCards';
import { MarketAnalysisCard } from './MarketAnalysisCard';
import { MarketCharts } from '@/components/market/MarketCharts';

export const EnhancedMarketPage = () => {
  const {
    filteredData,
    isLoading,
    isRefreshing,
    searchTerm,
    activeTab,
    error,
    handleRefresh,
    handleSearch,
    handleTabChange,
    getMarketCategories
  } = useMarketDataState();
  
  const [viewMode, setViewMode] = useState<'table' | 'charts'>('table');
  
  // Get market categories for tabs
  const categories = getMarketCategories();
  
  return (
    <div className="space-y-6">
      {/* Top trends and market health */}
      <MarketTrendCards 
        marketData={filteredData} 
        isLoading={isLoading} 
      />
      
      {/* Interactive market data section */}
      <Card className="overflow-hidden bg-card shadow-md border-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search markets, symbols, names..."
                value={searchTerm}
                onChange={handleSearch}
                className="max-w-md"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'table' | 'charts')} className="mr-2">
                <TabsList className="h-8 bg-muted">
                  <TabsTrigger value="table" className="text-xs px-3 py-1">
                    <BarChart className="h-3.5 w-3.5 mr-1" />
                    <span className="hidden sm:inline">Table</span>
                  </TabsTrigger>
                  <TabsTrigger value="charts" className="text-xs px-3 py-1">
                    <TrendingUp className="h-3.5 w-3.5 mr-1" />
                    <span className="hidden sm:inline">Charts</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-6">
            <TabsList className="flex flex-wrap gap-1 mb-6 bg-muted p-1">
              <TabsTrigger value="all" className="text-xs">
                All Markets
              </TabsTrigger>
              
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="text-xs"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {viewMode === 'table' ? (
            <MarketDataTable 
              data={filteredData} 
              isLoading={isLoading} 
            />
          ) : (
            <div className="h-[500px]">
              <MarketCharts 
                data={filteredData.slice(0, 10)} 
                isLoading={isLoading} 
                type="price"
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Market analysis and insights */}
      <MarketAnalysisCard 
        marketData={filteredData} 
        isLoading={isLoading} 
      />
    </div>
  );
};
