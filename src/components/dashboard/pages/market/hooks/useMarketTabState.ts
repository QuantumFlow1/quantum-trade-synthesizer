
import { useState } from 'react';
import { usePositions } from '@/hooks/use-positions';

export const useMarketTabState = () => {
  const [activeTab, setActiveTab] = useState('market');
  const { positions, isLoading } = usePositions();
  const [showCharts, setShowCharts] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const toggleChartsVisibility = () => {
    setShowCharts(!showCharts);
  };

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

  return {
    activeTab,
    setActiveTab,
    positions,
    isLoading,
    showCharts,
    toggleChartsVisibility,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage
  };
};
