
import { useState, useEffect, useRef } from "react";

// Storage key for Stockbot settings
const STOCKBOT_SETTINGS_KEY = 'stockbot-settings';

/**
 * Persist stockbot settings to localStorage
 */
export const saveStockbotSettings = (settings: { isSimulationMode: boolean }) => {
  try {
    localStorage.setItem(STOCKBOT_SETTINGS_KEY, JSON.stringify(settings));
    console.log('Stockbot settings saved:', settings);
  } catch (e) {
    console.error('Failed to save stockbot settings:', e);
  }
};

/**
 * Load stockbot settings from localStorage
 */
export const loadStockbotSettings = (): { isSimulationMode: boolean } => {
  try {
    const savedSettings = localStorage.getItem(STOCKBOT_SETTINGS_KEY);
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (e) {
    console.error('Failed to load stockbot settings:', e);
  }
  
  // Default settings
  return { isSimulationMode: true };
};

/**
 * Hook for managing stockbot simulation mode settings
 */
export const useStockbotSettings = () => {
  // Load saved settings
  const savedSettings = loadStockbotSettings();
  
  const [isSimulationMode, setIsSimulationMode] = useState(savedSettings.isSimulationMode);
  const manuallySetMode = useRef(false);
  
  // Persist simulation mode setting whenever it changes
  useEffect(() => {
    if (manuallySetMode.current) {
      saveStockbotSettings({ isSimulationMode });
      console.log("Simulation mode changed to:", isSimulationMode);
    }
  }, [isSimulationMode]);
  
  // Expose the custom setIsSimulationMode function that also persists the setting
  const handleSetSimulationMode = (newMode: boolean) => {
    console.log('Setting simulation mode to:', newMode);
    manuallySetMode.current = true;
    setIsSimulationMode(newMode);
    saveStockbotSettings({ isSimulationMode: newMode });
  };
  
  return {
    isSimulationMode,
    setIsSimulationMode: handleSetSimulationMode,
    manuallySetMode
  };
};
