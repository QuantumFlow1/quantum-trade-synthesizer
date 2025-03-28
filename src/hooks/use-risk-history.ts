import { useState, useEffect } from 'react';
import { RiskHistoryEntry, RiskMetric } from '@/types/risk';
import { useLocalStorage } from '@/hooks/use-local-storage';

export const useRiskHistory = () => {
  const [riskHistory, setRiskHistory] = useLocalStorage<RiskHistoryEntry[]>('riskHistory', []);
  
  // Add a new entry to risk history
  const addHistoryEntry = (metrics: RiskMetric[]) => {
    const newEntry: RiskHistoryEntry = {
      date: new Date().toISOString(),
      metrics: [...metrics]
    };
    
    setRiskHistory(prev => {
      // Keep only the last 30 entries to avoid localStorage size issues
      const updatedHistory = [newEntry, ...prev];
      if (updatedHistory.length > 30) {
        return updatedHistory.slice(0, 30);
      }
      return updatedHistory;
    });
  };
  
  // Clear history
  const clearHistory = () => {
    setRiskHistory([]);
  };
  
  return {
    riskHistory,
    addHistoryEntry,
    clearHistory
  };
};
