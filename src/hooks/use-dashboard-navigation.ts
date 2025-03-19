
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useDashboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract active page from URL path
  const getActivePageFromPath = () => {
    const path = location.pathname.split('/').filter(Boolean)[1] || "overview";
    // If the path is "llm", return "overview" instead
    return path === "llm" ? "overview" : path;
  };
  
  const [activePage, setActivePage] = useState<string>(getActivePageFromPath());
  const [openAgentsTab, setOpenAgentsTab] = useState<boolean>(false);
  const [showBackButton, setShowBackButton] = useState<boolean>(false);

  // Check if we came from admin page
  useEffect(() => {
    // Always check for fromAdminPage flag to ensure proper back button visibility
    const fromAdmin = localStorage.getItem('fromAdminPage');
    setShowBackButton(!!fromAdmin);
    console.log("Back button visibility check:", !!fromAdmin);
  }, [location.pathname]); // Re-check when pathname changes

  // Synchronize with localStorage for persistent tab selection
  useEffect(() => {
    const storedOpenAgentsTab = localStorage.getItem('openTradingAgentsTab');
    if (storedOpenAgentsTab === 'true') {
      setOpenAgentsTab(true);
      // Clear the flag after reading it
      localStorage.removeItem('openTradingAgentsTab');
    }
  }, []);

  useEffect(() => {
    // Update active page when location changes
    setActivePage(getActivePageFromPath());
  }, [location.pathname]);

  // Handle page navigation
  const handlePageChange = (page: string) => {
    // If trying to navigate to llm, redirect to overview
    const targetPage = page === "llm" ? "overview" : page;
    setActivePage(targetPage);
    navigate(`/dashboard/${targetPage === "overview" ? "" : targetPage}`);
  };

  // Handle back to admin
  const handleBackToAdmin = () => {
    console.log("Navigating back to admin");
    localStorage.removeItem('fromAdminPage');
    navigate('/admin');
  };

  // Helper function to check if a path is active
  const isActivePath = (path: string) => {
    return activePage === path;
  };

  // Open trading agents tab from different parts of the UI
  const openTradingAgentsTab = () => {
    // First navigate to trading page if not already there
    if (!isActivePath('trading')) {
      setActivePage('trading');
      navigate('/dashboard/trading');
    }
    
    // Set localStorage flag to open the Trading Agents tab
    localStorage.setItem('openTradingAgentsTab', 'true');
    setOpenAgentsTab(true);
  };

  // Function to navigate to specific LLM tools - now redirects to overview
  const navigateToLLM = () => {
    setActivePage('overview');
    navigate('/dashboard/overview');
  };

  return {
    activePage,
    openAgentsTab,
    showBackButton,
    setOpenAgentsTab,
    handlePageChange,
    handleBackToAdmin,
    isActivePath,
    openTradingAgentsTab,
    navigateToLLM
  };
};
