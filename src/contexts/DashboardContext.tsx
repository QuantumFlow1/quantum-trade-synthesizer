
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface DashboardContextType {
  refreshData: () => void;
  lastRefreshed: Date | null;
  isRefreshing: boolean;
}

// Create the context with a default value
const DashboardContext = createContext<DashboardContextType>({
  refreshData: () => {},
  lastRefreshed: null,
  isRefreshing: false,
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
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;
