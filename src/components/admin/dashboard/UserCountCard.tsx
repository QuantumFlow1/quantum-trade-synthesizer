
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const UserCountCard = () => {
  // Query to fetch users count from the profiles table
  const { data: userCountData, isLoading: userCountLoading } = useQuery({
    queryKey: ['userCount'],
    queryFn: async () => {
      try {
        console.log("Fetching user count...");
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error fetching user count:', error);
          throw error;
        }
        
        console.log("User count fetched:", count);
        return count || 0;
      } catch (err) {
        console.error('Error in user count query:', err);
        return 0;
      }
    }
  });

  // Determine user count to display
  const displayUserCount = userCountData !== undefined ? userCountData : 0;

  return (
    <Card className="bg-background/80 border border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Totale Gebruikers</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {userCountLoading ? (
            <span className="text-muted-foreground">Laden...</span>
          ) : (
            displayUserCount
          )}
        </div>
        <p className="text-xs text-muted-foreground">Actieve accounts</p>
      </CardContent>
    </Card>
  );
};

export default UserCountCard;
