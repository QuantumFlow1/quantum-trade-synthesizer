
import { ReactNode } from "react";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <DashboardProvider>
      <div className="min-h-screen p-6 space-y-6 bg-gradient-to-br from-background via-background/95 to-background/90">
        <Alert className="max-w-5xl mx-auto bg-primary/5 border-primary/20">
          <BookOpen className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong>Trading Guide:</strong> Follow our recommended practices for successful trading. Always use simulation mode to test strategies before real trading.
          </AlertDescription>
        </Alert>
        {children}
      </div>
    </DashboardProvider>
  );
};
