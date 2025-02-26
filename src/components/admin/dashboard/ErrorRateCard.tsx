
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ErrorRateCardProps {
  errorRate: number;
}

const ErrorRateCard = ({ errorRate }: ErrorRateCardProps) => {
  return (
    <Card className="bg-background/80 border border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{errorRate}%</div>
        <p className="text-xs text-muted-foreground">Laatste 24 uur</p>
      </CardContent>
    </Card>
  );
};

export default ErrorRateCard;
