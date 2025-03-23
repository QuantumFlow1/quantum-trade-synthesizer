
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercentage, formatLargeNumber } from '@/components/market/utils/formatters';

interface MarketDataTableProps {
  data: any[];
  isLoading: boolean;
}

export const MarketDataTable: React.FC<MarketDataTableProps> = ({
  data,
  isLoading
}) => {
  // Generate skeleton rows for loading state
  const skeletonRows = Array.from({ length: 10 }, (_, i) => (
    <TableRow key={`skeleton-${i}`}>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    </TableRow>
  ));

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[80px]">Market</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>24h Change</TableHead>
            <TableHead>Market Cap</TableHead>
            <TableHead>Volume (24h)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            skeletonRows
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mb-2 opacity-50" />
                  <p>No market data available</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={`${item.symbol}-${index}`} className="hover:bg-muted/50">
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {item.market || "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {item.symbol} {item.name && <span className="text-xs text-muted-foreground ml-1 hidden sm:inline">({item.name})</span>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CircleDollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                    {formatCurrency(item.price)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`flex items-center ${(item.change24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(item.change24h || 0) >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5 mr-1" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 mr-1" />
                    )}
                    {formatPercentage(item.change24h)}
                  </div>
                </TableCell>
                <TableCell>
                  ${formatLargeNumber(item.marketCap)}
                </TableCell>
                <TableCell>
                  ${formatLargeNumber(item.volume || item.totalVolume24h)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
