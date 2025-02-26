
import { Card } from "@/components/ui/card";
import { AlertCircle, Activity } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const MarketPage = () => {
  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Activity className="w-5 h-5 mr-2" /> Market Overview
          </h2>
        </div>

        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Coming Soon</AlertTitle>
          <AlertDescription>
            Market data functionality is currently being updated. A new and improved market data model will be available soon.
          </AlertDescription>
        </Alert>
      </Card>
    </div>
  );
};
