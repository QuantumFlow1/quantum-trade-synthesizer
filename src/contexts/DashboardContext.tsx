
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our widget visibility state
type WidgetVisibility = {
  market: boolean;
  performance: boolean;
  trading: boolean;
  autoTrading: boolean;
  riskManagement: boolean;
  transactions: boolean;
  alerts: boolean;
  advice: boolean;
  llmExtensions: boolean;
  apiAccess: boolean;
};

// Define types for API status
type ApiStatus = 'available' | 'unavailable' | 'checking';

// Define the context type
interface DashboardContextType {
  refreshData: () => void;
  lastRefreshed: Date | null;
  isRefreshing: boolean;
  visibleWidgets: WidgetVisibility;
  setVisibleWidgets: React.Dispatch<React.SetStateAction<WidgetVisibility>>;
  apiStatus: ApiStatus;
  setApiStatus: React.Dispatch<React.SetStateAction<ApiStatus>>;
}

// Default values for widget visibility
const defaultWidgetVisibility: WidgetVisibility = {
  market: true,
  performance: true,
  trading: true,
  autoTrading: false,
  riskManagement: true,
  transactions: true,
  alerts: true,
  advice: true,
  llmExtensions: true,
  apiAccess: false,
};

// Create the context with a default value
const DashboardContext = createContext<DashboardContextType>({
  refreshData: () => {},
  lastRefreshed: null,
  isRefreshing: false,
  visibleWidgets: defaultWidgetVisibility,
  setVisibleWidgets: () => {},
  apiStatus: 'checking',
  setApiStatus: () => {},
});

// Custom hook to use the Dashboard context
export const useDashboard = () => {
  return useContext(DashboardContext);
};

// Provider component
interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState<WidgetVisibility>(defaultWidgetVisibility);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');

  // Function to refresh dashboard data
  const refreshData = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <DashboardContext.Provider
      value={{
        refreshData,
        lastRefreshed,
        isRefreshing,
        visibleWidgets,
        setVisibleWidgets,
        apiStatus,
        setApiStatus,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;
