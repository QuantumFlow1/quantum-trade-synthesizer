
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, CircleDollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MarketPositionsPageProps {
  currentPage: number;
  itemsPerPage: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export const MarketPositionsPage: React.FC<MarketPositionsPageProps> = ({
  currentPage,
  itemsPerPage,
  onNextPage,
  onPreviousPage
}) => {
  // This is a placeholder - in a real app this would fetch actual position data
  const positions = [
    { id: 1, asset: 'BTC', type: 'long', entry: 42500, current: 43200, size: 0.5, pnl: 350, pnlPercent: 1.64 },
    { id: 2, asset: 'ETH', type: 'short', entry: 2800, current: 2750, size: 2.5, pnl: 125, pnlPercent: 1.78 },
    { id: 3, asset: 'SOL', type: 'long', entry: 145, current: 142, size: 15, pnl: -45, pnlPercent: -2.07 },
  ];

  const isLoading = false;

  // Generate skeleton rows for loading state
  const skeletonRows = Array.from({ length: 5 }, (_, i) => (
    <TableRow key={`skeleton-${i}`}>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    </TableRow>
  ));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Your Open Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Entry Price</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>PnL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              skeletonRows
            ) : positions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  You don't have any open positions yet.
                </TableCell>
              </TableRow>
            ) : (
              positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="font-medium">{position.asset}</TableCell>
                  <TableCell>
                    <Badge variant={position.type === 'long' ? 'default' : 'destructive'}>
                      {position.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CircleDollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                      {position.entry.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CircleDollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                      {position.current.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{position.size}</TableCell>
                  <TableCell>
                    <div className={`flex items-center ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {position.pnl >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 mr-1" />
                      )}
                      ${Math.abs(position.pnl).toLocaleString()} ({position.pnlPercent}%)
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center mt-4">
          <button 
            className="px-3 py-1 text-sm border rounded disabled:opacity-50" 
            onClick={onPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm">Page {currentPage}</span>
          <button 
            className="px-3 py-1 text-sm border rounded disabled:opacity-50" 
            onClick={onNextPage}
            disabled={positions.length < itemsPerPage}
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
