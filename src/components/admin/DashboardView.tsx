
import { useEffect } from "react";
import UserCountCard from "./dashboard/UserCountCard";
import SystemLoadCard from "./dashboard/SystemLoadCard";
import ErrorRateCard from "./dashboard/ErrorRateCard";
import MarketDataChart from "./dashboard/MarketDataChart";
import SentimentChart from "./dashboard/SentimentChart";

interface DashboardViewProps {
  systemLoad: number;
  errorRate: number;
}

const DashboardView = ({
  systemLoad,
  errorRate
}: DashboardViewProps) => {
  useEffect(() => {
    console.log('DashboardView rendered with props:', { systemLoad, errorRate });
  }, [systemLoad, errorRate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserCountCard />
        <SystemLoadCard systemLoad={systemLoad} />
        <ErrorRateCard errorRate={errorRate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MarketDataChart />
        <SentimentChart />
      </div>
    </div>
  );
};

export default DashboardView;
