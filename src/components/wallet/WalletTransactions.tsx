
import { useState, useEffect } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Calendar, 
  Filter, 
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'fee';
  status: 'completed' | 'pending' | 'failed';
  amount: number;
  currency: string;
  timestamp: Date;
  details: string;
  hash?: string;
}

export const WalletTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  const { toast } = useToast();
  const itemsPerPage = 10;

  // Generate mock transactions
  useEffect(() => {
    const generateMockTransactions = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate 25 random transactions
        const mockTransactions: Transaction[] = [];
        const types: Array<'deposit' | 'withdrawal' | 'trade' | 'fee'> = ['deposit', 'withdrawal', 'trade', 'fee'];
        const statuses: Array<'completed' | 'pending' | 'failed'> = ['completed', 'pending', 'failed'];
        const currencies = ['BTC', 'ETH', 'USDT', 'USD'];

        for (let i = 0; i < 25; i++) {
          const type = types[Math.floor(Math.random() * types.length)];
          const status = type === 'fee' ? 'completed' : statuses[Math.floor(Math.random() * statuses.length)];
          const currency = currencies[Math.floor(Math.random() * currencies.length)];
          
          // Calculate random amount based on type and currency
          let amount;
          switch (currency) {
            case 'BTC':
              amount = Math.random() * 0.5;
              break;
            case 'ETH':
              amount = Math.random() * 5;
              break;
            default:
              amount = Math.random() * 1000;
          }
          
          // For withdrawal, make amount negative
          if (type === 'withdrawal') {
            amount = -Math.abs(amount);
          }
          
          // For fees, make amount smaller and negative
          if (type === 'fee') {
            amount = -Math.abs(amount * 0.01);
          }

          const transactionDetails = {
            id: `tx-${Math.random().toString(36).substring(2, 10)}`,
            type,
            status,
            amount,
            currency,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date within last 30 days
            details: `${type.charAt(0).toUpperCase() + type.slice(1)} ${currency}`,
            hash: status !== 'failed' ? `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}` : undefined,
          };

          mockTransactions.push(transactionDetails);
        }

        // Sort by timestamp (most recent first)
        mockTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        setTransactions(mockTransactions);
        setTotalPages(Math.ceil(mockTransactions.length / itemsPerPage));
        setIsLoading(false);
      } catch (error) {
        console.error("Error generating mock transactions:", error);
        toast({
          title: "Error loading transactions",
          description: "Unable to load your transaction history. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    generateMockTransactions();
  }, [toast]);

  // Filter and paginate transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Apply search term filter
    const matchesSearch = !searchTerm || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.hash && transaction.hash.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply type filter
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate pagination
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update total pages when filters change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredTransactions.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredTransactions.length]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    if (['BTC', 'ETH'].includes(currency)) {
      return amount.toFixed(6);
    }
    return amount.toFixed(2);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="trade">Trades</SelectItem>
              <SelectItem value="fee">Fees</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Transactions table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : paginatedTransactions.length > 0 ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {transaction.type === 'deposit' ? (
                          <ArrowDownRight className="h-4 w-4 mr-2 text-green-500" />
                        ) : transaction.type === 'withdrawal' ? (
                          <ArrowUpRight className="h-4 w-4 mr-2 text-red-500" />
                        ) : (
                          <span className="w-4 h-4 mr-2 inline-block"></span>
                        )}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className={`font-medium ${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.amount >= 0 ? '+' : ''}
                      {formatAmount(transaction.amount, transaction.currency)} {transaction.currency}
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(transaction.status)}
                        <span className="capitalize text-sm">{transaction.status}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Badge variant="outline" className="text-xs">
                          {transaction.status}
                        </Badge>
                        
                        {transaction.hash && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a
                                  href={`https://etherscan.io/tx/${transaction.hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded-full hover:bg-secondary/50"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View on blockchain</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-64 border rounded-md">
          <div className="text-center">
            <p className="text-muted-foreground">No transactions found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
          </div>
        </div>
      )}
    </div>
  );
};
