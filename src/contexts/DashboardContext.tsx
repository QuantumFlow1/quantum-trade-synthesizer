
import { createContext, useContext, useState, ReactNode } from "react";

interface WidgetsState {
  market: boolean;
  performance: boolean;
  trading: boolean;
  autoTrading: boolean;
  riskManagement: boolean;
  transactions: boolean;
  alerts: boolean;
  advice: boolean;
  apiAccess: boolean;
  llmExtensions: boolean;
}

interface DashboardContextType {
  visibleWidgets: WidgetsState;
  setVisibleWidgets: React.Dispatch<React.SetStateAction<WidgetsState>>;
  apiStatus: 'checking' | 'available' | 'unavailable';
  setApiStatus: React.Dispatch<React.SetStateAction<'checking' | 'available' | 'unavailable'>>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [visibleWidgets, setVisibleWidgets] = useState<WidgetsState>({
    market: true,
    performance: true,
    trading: true,
    autoTrading: true,
    riskManagement: true,
    transactions: true,
    alerts: true,
    advice: true,
    apiAccess: false,
    llmExtensions: true
  });
  
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  const value = {
    visibleWidgets,
    setVisibleWidgets,
    apiStatus,
    setApiStatus
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
