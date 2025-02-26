
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserCountCardProps {
  count: number;
  isLoading: boolean;
}

const UserCountCard = ({ count, isLoading }: UserCountCardProps) => {
  return (
    <Card className="bg-background/80 border border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{count}</div>
        )}
        <p className="text-xs text-muted-foreground">Total registered users</p>
      </CardContent>
    </Card>
  );
};

export default UserCountCard;
