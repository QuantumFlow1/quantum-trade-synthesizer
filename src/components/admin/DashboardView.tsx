
import { useEffect, useState } from "react";
import UserCountCard from "./dashboard/UserCountCard";
import SystemLoadCard from "./dashboard/SystemLoadCard";
import ErrorRateCard from "./dashboard/ErrorRateCard";
import MarketDataChart from "./dashboard/MarketDataChart";
import SentimentChart from "./dashboard/SentimentChart";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error fetching user count:', error);
          toast({
            title: "Error fetching data",
            description: "Could not retrieve user count. Using default value.",
            variant: "destructive",
          });
          setUserCount(42); // Fallback to a default value
          setHasError(true);
        } else {
          setUserCount(count || 0);
          console.log('User count retrieved:', count);
        }
      } catch (error) {
        console.error('Exception fetching user count:', error);
        toast({
          title: "Error fetching data",
          description: "An exception occurred while retrieving user count. Using default value.",
          variant: "destructive",
        });
        setUserCount(42); // Fallback to a default value
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCount();
  }, [toast]);

  // Debugging logs
  useEffect(() => {
    console.log('DashboardView rendered with props:', { 
      systemLoad, 
      errorRate, 
      userCount, 
      isLoading,
      hasError 
    });
  }, [systemLoad, errorRate, userCount, isLoading, hasError]);

  // If there's a critical rendering issue, provide a fallback UI
  if (hasError && !isLoading) {
    return (
      <div className="p-4 bg-background/80 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Dashboard</h2>
        <p className="text-muted-foreground mb-4">
          Some data could not be loaded. Showing partial information.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UserCountCard count={userCount} isLoading={false} />
          <SystemLoadCard systemLoad={systemLoad} />
          <ErrorRateCard errorRate={errorRate} />
        </div>
      </div>
    );
  }

  // Guard against incomplete rendering
  if (isLoading) {
    return (
      <div className="space-y-6 p-4 bg-background/80 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

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
