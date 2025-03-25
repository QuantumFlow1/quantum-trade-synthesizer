
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { useRiskSettings } from '@/hooks/use-risk-settings';

export const RiskWarnings = () => {
  const { riskSettings } = useRiskSettings();
  
  // Example warnings based on risk settings
  const warnings = [
    {
      id: 1,
      level: 'high',
      title: 'High Daily Loss Risk',
      description: `Your max daily loss is set to ${riskSettings.max_daily_loss}. This is higher than the recommended 5% of portfolio value.`,
      show: riskSettings.max_daily_loss > 100
    },
    {
      id: 2,
      level: 'medium',
      title: 'Leverage Warning',
      description: `You're currently using a maximum leverage of ${riskSettings.max_leverage}x. Consider reducing leverage to minimize risk.`,
      show: riskSettings.max_leverage > 1.5
    },
    {
      id: 3,
      level: 'low',
      title: 'Risk/Reward Ratio',
      description: `Your risk/reward target is ${riskSettings.risk_reward_target}. A minimum of 2:1 is generally recommended.`,
      show: riskSettings.risk_reward_target < 2
    }
  ];
  
  const activeWarnings = warnings.filter(w => w.show);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Risk Warnings and Alerts</h3>
      
      {activeWarnings.length === 0 ? (
        <Alert className="bg-green-50 border-green-200">
          <InfoCircledIcon className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">All Clear</AlertTitle>
          <AlertDescription className="text-green-700">
            No risk warnings detected with your current settings. Good job maintaining a balanced risk profile!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {activeWarnings.map(warning => (
            <Alert 
              key={warning.id}
              className={warning.level === 'high' 
                ? 'bg-red-50 border-red-200' 
                : warning.level === 'medium'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-blue-50 border-blue-200'
              }
            >
              <ExclamationTriangleIcon className={`h-4 w-4 ${
                warning.level === 'high' 
                  ? 'text-red-600' 
                  : warning.level === 'medium'
                  ? 'text-yellow-600'
                  : 'text-blue-600'
              }`} />
              <AlertTitle className={warning.level === 'high' 
                ? 'text-red-800' 
                : warning.level === 'medium'
                ? 'text-yellow-800'
                : 'text-blue-800'
              }>
                {warning.title}
              </AlertTitle>
              <AlertDescription className={warning.level === 'high' 
                ? 'text-red-700' 
                : warning.level === 'medium'
                ? 'text-yellow-700'
                : 'text-blue-700'
              }>
                {warning.description}
              </AlertDescription>
            </Alert>
          ))}
          
          <Button variant="outline" className="mt-2">
            Acknowledge All Warnings
          </Button>
        </div>
      )}
    </div>
  );
};
