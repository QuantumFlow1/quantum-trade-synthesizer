
import { Shield, Search, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const { toast } = useToast();

  const handleVerify = () => {
    toast({
      title: "Verificatie Uitgevoerd",
      description: "Alle transacties zijn geverifieerd",
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Admin Control Panel</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="font-medium mb-1">Actieve Users</div>
          <div className="text-2xl font-bold">1,234</div>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="font-medium mb-1">Open Orders</div>
          <div className="text-2xl font-bold">567</div>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="font-medium mb-1">Dagelijks Volume</div>
          <div className="text-2xl font-bold">$2.5M</div>
        </div>
        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="font-medium mb-1">Systeem Status</div>
          <div className="text-2xl font-bold text-green-400">Normaal</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-2">Snelle Acties</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleVerify}>
              <Search className="w-4 h-4 mr-2" />
              Verifieer Trades
            </Button>
            <Button variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Risk Check
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Systeem Alerts</h3>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400 text-sm">
              Hoge trading volume op BTC/USD
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 text-green-400 text-sm">
              Alle systemen operationeel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
