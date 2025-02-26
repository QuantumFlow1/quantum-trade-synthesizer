
import { useEffect, useState } from "react";
import UserCountCard from "./dashboard/UserCountCard";
import SystemLoadCard from "./dashboard/SystemLoadCard";
import ErrorRateCard from "./dashboard/ErrorRateCard";
import MarketDataChart from "./dashboard/MarketDataChart";
import SentimentChart from "./dashboard/SentimentChart";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface DashboardViewProps {
  systemLoad: number;
  errorRate: number;
}

const DashboardView = ({
  systemLoad,
  errorRate
}: DashboardViewProps) => {
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setIsLoading(true);
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error fetching user count:', error);
          toast({
            title: "Error fetching data",
            description: "Could not retrieve user count.",
            variant: "destructive",
          });
          setUserCount(0);
        } else {
          setUserCount(count || 0);
          console.log('User count retrieved:', count);
        }
      } catch (error) {
        console.error('Exception fetching user count:', error);
        toast({
          title: "Error fetching data",
          description: "An exception occurred while retrieving user count.",
          variant: "destructive",
        });
        setUserCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCount();
  }, [toast]);

  useEffect(() => {
    console.log('DashboardView rendered with props:', { systemLoad, errorRate, userCount, isLoading });
  }, [systemLoad, errorRate, userCount, isLoading]);

  return (
    <div className="space-y-6 p-4 bg-background/80 rounded-lg shadow-sm animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserCountCard count={userCount} isLoading={isLoading} />
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
