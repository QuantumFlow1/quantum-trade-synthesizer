
import { ReactNode } from "react";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Brain, TrendingUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
        <ScrollArea className="h-screen">
          <div className="p-6 space-y-6">
            <Alert className="max-w-5xl mx-auto bg-primary/5 border-primary/20">
              <div className="flex space-x-2">
                <BookOpen className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <AlertDescription className="font-medium">
                    <strong>AI Hedge Fund Trading Guide:</strong> Our multi-agent AI system helps you make informed trading decisions.
                  </AlertDescription>
                  <AlertDescription className="text-xs mt-1">
                    <span className="flex items-center gap-1">
                      <Brain className="h-3 w-3 text-primary" /> 
                      <span>Specialized agents analyze the market from different perspectives</span>
                    </span>
                    <span className="flex items-center gap-1 mt-0.5">
                      <TrendingUp className="h-3 w-3 text-primary" /> 
                      <span>Always use simulation mode to test strategies before real trading</span>
                    </span>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
            {children}
          </div>
        </ScrollArea>
      </div>
    </DashboardProvider>
  );
};
