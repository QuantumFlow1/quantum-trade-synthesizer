
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
    <div className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-lg" />
      <div className="relative flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gradient">Welcome Commander, {userEmail}</h1>
          <p className="text-muted-foreground">
            Quantum Trading Interface 
            {isLovTrader && <span className="ml-2 inline-flex items-center text-primary"><Unlock className="w-3 h-3 mr-1" /> API Access Enabled</span>}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Uitloggen
        </Button>
      </div>
    </div>
  );
};
