
import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MarketHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const MarketHeader: React.FC<MarketHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  isRefreshing
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold">Market Overview</h1>
      
      <div className="flex gap-2 w-full md:w-auto">
        <div className="relative flex-grow md:w-60">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search markets..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-9"
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
