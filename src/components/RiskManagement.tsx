
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskMetrics } from '@/components/risk/RiskMetrics';
import { RiskSettings } from '@/components/risk/RiskSettings';
import { RiskWarnings } from '@/components/risk/RiskWarnings';
import { RiskHistory } from '@/components/risk/RiskHistory';
import { RiskReportGenerator } from '@/components/risk/RiskReportGenerator';
import { RiskMetric } from '@/types/risk';
import { useRiskSettings } from '@/hooks/use-risk-settings';
import { useRiskHistory } from '@/hooks/use-risk-history';

const RiskManagement = () => {
  // Example risk metrics
  const riskMetrics: RiskMetric[] = [
    { name: 'Portfolio Volatility', value: 15, maxValue: 40, status: 'low' },
    { name: 'Leverage Ratio', value: 2.5, maxValue: 5, status: 'medium' },
    { name: 'Concentration Risk', value: 30, maxValue: 50, status: 'medium' },
    { name: 'Drawdown', value: 8, maxValue: 25, status: 'low' },
  ];
  
  const { riskSettings } = useRiskSettings();
  const { riskHistory, addHistoryEntry, clearHistory } = useRiskHistory();
  
  // Record risk metrics in history periodically
  useEffect(() => {
    // Add the current metrics to history when component mounts
    addHistoryEntry(riskMetrics);
    
    // Set up a periodic update (e.g., every hour in a real application)
    // For demo purposes, we'll use a shorter interval
    const interval = setInterval(() => {
      // In a real app, you would fetch the latest metrics here
      // For demo, we'll generate slightly different metrics
      const updatedMetrics: RiskMetric[] = riskMetrics.map(metric => {
        // Generate a random status based on the value
        let newStatus: 'low' | 'medium' | 'high';
        if (Math.random() > 0.8) {
          newStatus = Math.random() > 0.5 ? 'high' : 'medium';
        } else {
          newStatus = Math.random() > 0.5 ? 'medium' : 'low';
        }
        
        // Return the updated metric
        return {
          ...metric,
          value: Math.min(
            metric.maxValue, 
            Math.max(1, metric.value + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5)
          ),
          status: newStatus
        };
      });
      
      addHistoryEntry(updatedMetrics);
    }, 30000); // Every 30 seconds for demo
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Risk Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics">
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="warnings">Warnings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics">
            <RiskMetrics metrics={riskMetrics} />
          </TabsContent>
          
          <TabsContent value="history">
            <RiskHistory 
              history={riskHistory} 
              onClearHistory={clearHistory} 
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <RiskSettings />
          </TabsContent>
          
          <TabsContent value="warnings">
            <RiskWarnings />
          </TabsContent>
          
          <TabsContent value="reports">
            <RiskReportGenerator 
              settings={riskSettings}
              currentMetrics={riskMetrics}
              history={riskHistory}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RiskManagement;
