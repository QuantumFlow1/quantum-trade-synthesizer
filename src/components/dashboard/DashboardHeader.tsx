
import { LogOut, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  userEmail?: string;
  isLovTrader: boolean;
}

export const DashboardHeader = ({ userEmail, isLovTrader }: DashboardHeaderProps) => {
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-lg" />
      
      {/* Animated background effects */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="relative flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gradient">Welcome Commander, {userEmail}</h1>
          <p className="text-muted-foreground">
            Quantum Trading Interface 
            {isLovTrader && (
              <span className="ml-2 inline-flex items-center text-primary animate-pulse">
                <Unlock className="w-3 h-3 mr-1" /> 
                API Access Enabled
              </span>
            )}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Uitloggen
        </Button>
      </div>
    </div>
  );
};
