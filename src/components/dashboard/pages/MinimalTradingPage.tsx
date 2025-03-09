
import { useState } from "react";
import { MinimalTradingTab } from "@/components/trading/minimal/MinimalTradingTab";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { useNavigate } from "react-router-dom";

export const MinimalTradingPage = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("trading");

  const handlePageChange = (page: string) => {
    setActivePage(page);
    navigate(`/dashboard/${page === "overview" ? "" : page}`);
  };

  return (
    <div className="space-y-6">
      <DashboardNavigation 
        activePage={activePage}
        onChangePage={handlePageChange}
      />
      
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Trading Dashboard</h2>
        <p className="text-muted-foreground">
          A streamlined trading interface with market data, price charts, and AI-powered trading agents.
        </p>
      </div>
      <MinimalTradingTab />
    </div>
  );
};
