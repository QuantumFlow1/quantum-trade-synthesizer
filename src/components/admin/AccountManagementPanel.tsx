
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Account {
  id: string;
  name: string;
  status: "active" | "suspended" | "pending";
  riskLevel: "low" | "medium" | "high";
  lastActivity: string;
  securityLevel: "standard" | "enhanced" | "maximum";
}

const AccountManagementPanel = () => {
  const { toast } = useToast();
  const [accounts] = useState<Account[]>([
    {
      id: "1",
      name: "Hoofdrekening Trading",
      status: "active",
      riskLevel: "low",
      lastActivity: "Nu",
      securityLevel: "maximum"
    },
    {
      id: "2",
      name: "Institutionele Rekening",
      status: "active",
      riskLevel: "medium",
      lastActivity: "5 min geleden",
      securityLevel: "enhanced"
    }
  ]);

  const handleSecurityAudit = (accountId: string) => {
    toast({
      title: "Security Audit Gestart",
      description: `Veiligheidscontrole wordt uitgevoerd voor rekening ${accountId}`,
    });
  };

  const handleSuspendAccount = (accountId: string) => {
    toast({
      title: "Rekening Gepauzeerd",
      description: "De rekening is tijdelijk gepauzeerd voor veiligheidscontrole",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold">Rekeningen Beheer</h2>
        </div>
        <Button onClick={() => {
          toast({
            title: "Globale Veiligheidscontrole",
            description: "Controle van alle rekeningen gestart",
          });
        }}>
          <Lock className="w-4 h-4 mr-2" />
          Globale Controle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {account.name}
                </CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  account.status === 'active' ? 'bg-green-100 text-green-800' :
                  account.status === 'suspended' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {account.status}
                </span>
              </div>
              <CardDescription>
                Laatste activiteit: {account.lastActivity}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Risico niveau:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    account.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                    account.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {account.riskLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Beveiliging:</span>
                  <span className="text-sm font-medium">{account.securityLevel}</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSecurityAudit(account.id)}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Security Audit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleSuspendAccount(account.id)}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Pauzeer Rekening
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccountManagementPanel;
