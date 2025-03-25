
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { RiskMetric } from '@/types/risk';

interface RiskMetricsProps {
  metrics: RiskMetric[];
}

export const RiskMetrics: React.FC<RiskMetricsProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Current Risk Metrics</h3>
      
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{metric.name}</span>
              <span 
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  metric.status === 'low' 
                    ? 'bg-green-100 text-green-800' 
                    : metric.status === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {metric.status === 'low' ? 'Low' : metric.status === 'medium' ? 'Medium' : 'High'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Progress 
                value={(metric.value / metric.maxValue) * 100} 
                className={`h-2 ${
                  metric.status === 'low' 
                    ? 'bg-green-100' 
                    : metric.status === 'medium'
                    ? 'bg-yellow-100'
                    : 'bg-red-100'
                }`}
              />
              <span className="text-sm text-gray-500">
                {metric.value} / {metric.maxValue}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          These metrics provide an overview of your portfolio's risk profile. Keep them in the low to medium range for a balanced approach.
        </p>
      </div>
    </div>
  );
};
