
import { useState, useEffect } from 'react';
import { RiskSettings, defaultRiskSettings } from '@/types/risk';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from "@/hooks/use-toast";

export const useRiskSettings = () => {
  const { toast } = useToast();
  const [riskSettings, setRiskSettings] = useLocalStorage<RiskSettings>('riskSettings', {
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
    
    toast({
      title: "Risk settings updated",
      description: "Your risk management preferences have been saved.",
    });
  };

  // Reset to default settings
  const resetSettings = () => {
    setRiskSettings({...defaultRiskSettings as RiskSettings});
    localStorage.removeItem('riskSettings');
    
    toast({
      title: "Risk settings reset",
      description: "Your risk settings have been reset to defaults.",
    });
  };

  return {
    riskSettings,
    updateRiskSettings,
    resetSettings
  };
};
