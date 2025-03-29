
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DashboardPageContent } from '@/components/dashboard/DashboardPageContent';
import { useDashboardNavigation } from '@/hooks/use-dashboard-navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export const DashboardContent = () => {
  const { userProfile } = useAuth();
  const { activePage, openAgentsTab, openTradingAgentsTab } = useDashboardNavigation();
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [showVirtualEnvironment, setShowVirtualEnvironment] = useState(false);
  
  // Check if the user has API access
  const hasApiAccess = userProfile?.api_access || userProfile?.role === 'lov_trader';
  const isLovTrader = userProfile?.role === 'lov_trader';

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Mock API check (would be a real API call in production)
        const delay = Math.random() * 1000 + 500; // Random delay between 500-1500ms
        await new Promise(resolve => setTimeout(resolve, delay));
        
        setApiStatus(Math.random() > 0.2 ? 'available' : 'unavailable');
      } catch (error) {
        console.error('API check failed:', error);
        setApiStatus('unavailable');
      }
    };
    
    checkApiStatus();
  }, []);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        userEmail={userProfile?.email} 
        isLovTrader={isLovTrader}
      />
      
      <DashboardPageContent
        activePage={activePage}
        apiStatus={apiStatus}
        showVirtualEnvironment={showVirtualEnvironment}
        visibleWidgets={{ apiAccess: hasApiAccess }}
        openAgentsTab={openAgentsTab}
        openTradingAgentsTab={openTradingAgentsTab}
      />
    </div>
  );
};
