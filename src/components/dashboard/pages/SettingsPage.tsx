
import AutoTrading from "@/components/AutoTrading";
import { Card } from "@/components/ui/card";
import { Settings, Zap, CreditCard } from "lucide-react";
import { DashboardSettings } from "@/components/DashboardSettings";
import { SubscriptionTiers } from "@/components/subscription/SubscriptionTiers";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

export const SettingsPage = () => {
  const { userProfile } = useAuth();
  
  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><Settings className="w-5 h-5 mr-2" /> Dashboard Settings</h2>
        <DashboardSettings />
      </Card>
      
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><CreditCard className="w-5 h-5 mr-2" /> Subscription Status</h2>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Current Plan: <span className="text-primary font-bold capitalize">{userProfile?.subscription_tier || 'Free'}</span></p>
              <p className="text-muted-foreground text-sm mt-1">Upgrade your plan to access advanced features</p>
            </div>
            <Link to="/subscription">
              <Button variant="default" className="flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </Link>
          </div>
        </div>
      </Card>
      
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4 flex items-center"><Zap className="w-5 h-5 mr-2" /> Auto Trading Settings</h2>
        <AutoTrading />
      </Card>
    </div>
  );
};
