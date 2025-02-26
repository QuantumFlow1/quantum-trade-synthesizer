
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface SystemLoadCardProps {
  systemLoad: number;
}

const SystemLoadCard = ({ systemLoad }: SystemLoadCardProps) => {
  return (
    <Card className="bg-background/80 border border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Systeem Load</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{systemLoad}%</div>
        <p className="text-xs text-muted-foreground">Huidige belasting</p>
      </CardContent>
    </Card>
  );
};

export default SystemLoadCard;
