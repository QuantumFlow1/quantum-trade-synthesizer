
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TransactionFilters } from "./transactions/TransactionFilters";
import { TransactionTable } from "./transactions/TransactionTable";
import { TransactionPagination } from "./transactions/TransactionPagination";
import { EmptyTransactions } from "./transactions/EmptyTransactions";

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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <TransactionFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      {/* Transactions table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : paginatedTransactions.length > 0 ? (
        <>
          <TransactionTable 
            transactions={paginatedTransactions}
            formatAmount={formatAmount}
            formatDate={formatDate}
          />
          
          {/* Pagination */}
          <TransactionPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        </>
      ) : (
        <EmptyTransactions />
      )}
    </div>
  );
};
