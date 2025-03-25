
import { useState, useEffect } from 'react';
import { RiskSettings, defaultRiskSettings } from '@/types/risk';

export const useRiskSettings = () => {
  const [riskSettings, setRiskSettings] = useState<RiskSettings>({
    ...defaultRiskSettings as RiskSettings
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('riskSettings');
    if (savedSettings) {
      try {
        setRiskSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error parsing saved risk settings:', error);
      }
    }
  }, []);

  // Update risk settings and save to localStorage
  const updateRiskSettings = (newSettings: RiskSettings) => {
    setRiskSettings(newSettings);
    localStorage.setItem('riskSettings', JSON.stringify(newSettings));
  };

  // Reset to default settings
  const resetSettings = () => {
    setRiskSettings({...defaultRiskSettings as RiskSettings});
    localStorage.removeItem('riskSettings');
  };

  return {
    riskSettings,
    updateRiskSettings,
    resetSettings
  };
};
