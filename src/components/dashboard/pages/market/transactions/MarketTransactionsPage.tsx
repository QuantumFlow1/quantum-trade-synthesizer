
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, CircleDollarSign, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MarketTransactionsPageProps {
  currentPage: number;
  itemsPerPage: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export const MarketTransactionsPage: React.FC<MarketTransactionsPageProps> = ({
  currentPage,
  itemsPerPage,
  onNextPage,
  onPreviousPage
}) => {
  // This is a placeholder - in a real app this would fetch actual transaction data
  const transactions = [
    { 
      id: 't1', 
      asset: 'BTC', 
      type: 'buy', 
      price: 42500, 
      amount: 0.5, 
      total: 21250, 
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed'
    },
    { 
      id: 't2', 
      asset: 'ETH', 
      type: 'sell', 
      price: 2800, 
      amount: 2.5, 
      total: 7000, 
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'completed'
    },
    { 
      id: 't3', 
      asset: 'SOL', 
      type: 'buy', 
      price: 145, 
      amount: 15, 
      total: 2175, 
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      status: 'completed'
    },
  ];

  const isLoading = false;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Generate skeleton rows for loading state
  const skeletonRows = Array.from({ length: 5 }, (_, i) => (
    <TableRow key={`skeleton-${i}`}>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
    </TableRow>
  ));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              skeletonRows
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.asset}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'buy' ? 'default' : 'destructive'} className="capitalize">
                      {transaction.type === 'buy' ? (
                        <ArrowDownRight className="h-3.5 w-3.5 mr-1 inline" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5 mr-1 inline" />
                      )}
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CircleDollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                      {transaction.price.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CircleDollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                      {transaction.total.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      {formatDate(transaction.timestamp)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {transaction.status}
                    </Badge>
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
            disabled={transactions.length < itemsPerPage}
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
