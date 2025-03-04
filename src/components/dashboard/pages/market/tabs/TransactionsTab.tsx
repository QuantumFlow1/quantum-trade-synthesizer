
import React from 'react';
import { Card } from '@/components/ui/card';
import TransactionList from '@/components/TransactionList';
import { TransactionFilters } from '@/components/wallet/transactions/TransactionFilters';
import { TransactionPagination } from '@/components/wallet/transactions/TransactionPagination';

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
