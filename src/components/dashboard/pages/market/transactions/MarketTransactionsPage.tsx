
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight, CircleDollarSign, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  asset: string;
  amount: number;
  price: number;
  total: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

interface MarketTransactionsPageProps {
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const MarketTransactionsPage: React.FC<MarketTransactionsPageProps> = ({
  currentPage,
  itemsPerPage,
  onPageChange
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Mocked transaction data - in a real app, this would come from an API
  const transactions: Transaction[] = [
    {
      id: 'txn-001',
      type: 'buy',
      asset: 'BTC',
      amount: 0.25,
      price: 42500,
      total: 10625,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'completed'
    },
    {
      id: 'txn-002',
      type: 'sell',
      asset: 'ETH',
      amount: 1.5,
      price: 2800,
      total: 4200,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      status: 'completed'
    },
    {
      id: 'txn-003',
      type: 'buy',
      asset: 'SOL',
      amount: 10,
      price: 145,
      total: 1450,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: 'completed'
    },
    {
      id: 'txn-004',
      type: 'buy',
      asset: 'AVAX',
      amount: 5,
      price: 32.5,
      total: 162.5,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'completed'
    },
    {
      id: 'txn-005',
      type: 'sell',
      asset: 'DOT',
      amount: 25,
      price: 7.8,
      total: 195,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: 'completed'
    }
  ];
  
  // Filtering by page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  
  // Generate skeleton rows for loading state
  const skeletonRows = Array.from({ length: itemsPerPage }, (_, i) => (
    <TableRow key={`skeleton-${i}`}>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
    </TableRow>
  ));

  const formatDateTime = (date: Date) => {
    return format(date, 'MMM d, yyyy HH:mm');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              skeletonRows
            ) : paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className={`flex items-center ${transaction.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'buy' ? (
                        <ArrowDownLeft className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      )}
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{transaction.asset}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CircleDollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                      {transaction.price.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center font-medium">
                      <CircleDollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                      {transaction.total.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDateTime(transaction.timestamp)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        transaction.status === 'completed' ? 'default' : 
                        transaction.status === 'pending' ? 'outline' : 
                        'destructive'
                      }
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button 
            className="px-3 py-1 text-sm border rounded disabled:opacity-50" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <button 
            className="px-3 py-1 text-sm border rounded disabled:opacity-50" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
