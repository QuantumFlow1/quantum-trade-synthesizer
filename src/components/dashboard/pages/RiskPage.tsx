
import React from 'react';
import RiskManagement from '@/components/RiskManagement';

export const RiskPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Risk Management</h1>
      <p className="text-muted-foreground">
        Monitor and control your trading risks. Set risk parameters, analyze your risk exposure, and receive warnings when approaching your risk limits.
      </p>
      
      <RiskManagement />
    </div>
  );
};
