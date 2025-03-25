
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskMetrics } from '@/components/risk/RiskMetrics';
import { RiskSettings } from '@/components/risk/RiskSettings';
import { RiskWarnings } from '@/components/risk/RiskWarnings';
import { RiskMetric } from '@/types/risk';

const RiskManagement = () => {
  // Example risk metrics
  const riskMetrics: RiskMetric[] = [
    { name: 'Portfolio Volatility', value: 15, maxValue: 40, status: 'low' },
    { name: 'Leverage Ratio', value: 2.5, maxValue: 5, status: 'medium' },
    { name: 'Concentration Risk', value: 30, maxValue: 50, status: 'medium' },
    { name: 'Drawdown', value: 8, maxValue: 25, status: 'low' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Risk Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics">
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="warnings">Warnings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics">
            <RiskMetrics metrics={riskMetrics} />
          </TabsContent>
          
          <TabsContent value="settings">
            <RiskSettings />
          </TabsContent>
          
          <TabsContent value="warnings">
            <RiskWarnings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RiskManagement;
