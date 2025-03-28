
import React from 'react';
import RiskManagement from '@/components/RiskManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, TrendingDown, BarChart3, AlertTriangle } from 'lucide-react';

export const RiskPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Risk Management</h1>
        <p className="text-muted-foreground">
          Monitor and control your trading risks. Set risk parameters, analyze your risk exposure, and receive warnings when approaching your risk limits.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-500 mr-2" />
              <CardTitle className="text-lg">Risk Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Set your risk parameters and control exposure with custom settings.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
              <CardTitle className="text-lg">Drawdown Control</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Monitor and limit drawdowns to protect your capital.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
              <CardTitle className="text-lg">Metrics History</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Track your risk metrics over time and analyze patterns.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              <CardTitle className="text-lg">Risk Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Receive automated warnings when your risk levels exceed thresholds.</p>
          </CardContent>
        </Card>
      </div>
      
      <RiskManagement />
    </div>
  );
};
