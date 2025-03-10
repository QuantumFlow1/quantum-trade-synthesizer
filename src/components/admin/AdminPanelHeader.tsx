
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { LogOut, Settings, User, Database, Key } from "lucide-react";
import { Agent } from "@/types/agent";

interface AdminPanelHeaderProps {
  onDashboardClick: () => void;
  onAccountManagement: () => void;
  onApiKeyManagement: () => void;
  onAddAgent: () => void;
  onSignOut: () => void;
  setShowUserDashboard: (show: boolean) => void;
  setShowAccountManagement: (show: boolean) => void;
  setAgents: (agents: Agent[]) => void;
}

const AdminPanelHeader = ({
  onDashboardClick,
  onAccountManagement,
  onApiKeyManagement,
  onAddAgent,
  onSignOut,
  setShowUserDashboard,
  setShowAccountManagement,
  setAgents
}: AdminPanelHeaderProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewDashboard = () => {
    onDashboardClick();
  };

  const handleAccountManagement = () => {
    onAccountManagement();
  };
  
  const handleApiKeyManagement = () => {
    onApiKeyManagement();
  };

  const handleFetchAgents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setAgents(data || []);
      
      toast({
        title: "Success",
        description: `Retrieved ${data?.length || 0} agents from the database.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch agents. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Manage your application settings</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleViewDashboard}>
                <Database className="mr-2 h-4 w-4" />
                View User Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAccountManagement}>
                <User className="mr-2 h-4 w-4" />
                User Management
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleApiKeyManagement}>
                <Key className="mr-2 h-4 w-4" />
                API Key Management
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button onClick={handleViewDashboard}>
            View User Dashboard
          </Button>
          <Button onClick={handleAccountManagement} variant="outline">
            User Management
          </Button>
          <Button onClick={handleApiKeyManagement} variant="outline">
            API Key Management
          </Button>
          <Button 
            onClick={handleFetchAgents} 
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Fetch Agents'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPanelHeader;
