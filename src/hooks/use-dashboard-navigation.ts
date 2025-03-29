
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useDashboardNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState('overview');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/overview')) setActivePage('overview');
    else if (path.includes('/market')) setActivePage('market');
    else if (path.includes('/trading')) setActivePage('trading');
    else if (path.includes('/ai')) setActivePage('ai');
    else if (path.includes('/risk')) setActivePage('risk');
    else if (path === '/dashboard' || path === '/dashboard/') setActivePage('overview');
  }, [location.pathname]);

  const openAgentsTab = () => {
    navigate('/dashboard/ai?tab=agents');
  };

  const openTradingAgentsTab = () => {
    navigate('/dashboard/trading?tab=agents');
  };

  return {
    activePage,
    openAgentsTab,
    openTradingAgentsTab,
  };
}
