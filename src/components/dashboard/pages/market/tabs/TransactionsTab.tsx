
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import TransactionList from '@/components/TransactionList';
import { TransactionFilters } from '@/components/wallet/transactions/TransactionFilters';
import { TransactionPagination } from '@/components/wallet/transactions/TransactionPagination';
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { logApiCall } from "@/utils/apiLogger";
import { toast } from "@/components/ui/use-toast";

interface TransactionsTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchTransactionCount = async () => {
      setIsLoading(true);
      try {
        await logApiCall('transactions/count', 'TransactionsTab', 'pending');
        
        const { count, error } = await supabase
          .from('trades')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        setTransactionCount(count || 0);
        await logApiCall('transactions/count', 'TransactionsTab', 'success');
      } catch (error: any) {
        console.error('Error fetching transaction count:', error.message);
        await logApiCall('transactions/count', 'TransactionsTab', 'error', error.message);
        toast({
          title: 'Error',
          description: 'Failed to fetch transaction count',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactionCount();
  }, [user]);
  
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <TransactionFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        
        <TransactionList />
        
        <TransactionPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
        />
      </div>
    </Card>
  );
};
