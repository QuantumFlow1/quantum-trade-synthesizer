
import { LogOut, Activity, LineChart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";

const UserDashboard = () => {
  const { signOut, userProfile } = useAuth();
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Actie uitgevoerd",
      description: `${action} is succesvol uitgevoerd`,
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welkom, {userProfile?.email}</h1>
          <p className="text-muted-foreground">Dashboard Overzicht</p>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Uitloggen
        </Button>
      </div>

      {/* Statistieken */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Actieve Sessies</h3>
          </div>
          <p className="text-2xl font-bold mt-2">3</p>
        </div>
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">Performance</h3>
          </div>
          <p className="text-2xl font-bold mt-2">+12.5%</p>
        </div>
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <h3 className="font-medium">Alerts</h3>
          </div>
          <p className="text-2xl font-bold mt-2">2</p>
        </div>
      </div>

      {/* Acties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium mb-4">Snelle Acties</h3>
          <div className="space-y-2">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleAction("Data analyse")}
            >
              <Activity className="w-4 h-4 mr-2" />
              Start Data Analyse
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleAction("Rapport generatie")}
            >
              <LineChart className="w-4 h-4 mr-2" />
              Genereer Rapport
            </Button>
          </div>
        </div>

        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-500">
                <AlertCircle className="w-4 h-4" />
                <p className="font-medium">Systeem Update</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Er staat een nieuwe systeem update klaar
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <div className="flex items-center gap-2 text-blue-500">
                <Activity className="w-4 h-4" />
                <p className="font-medium">Performance Alert</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Positieve performance trend gedetecteerd
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
