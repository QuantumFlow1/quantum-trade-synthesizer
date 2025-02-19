
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserDashboard from "@/components/UserDashboard";

interface DashboardViewProps {
  onBack: () => void;
}

const DashboardView = ({ onBack }: DashboardViewProps) => {
  return (
    <div>
      <div className="p-4 bg-background border-b">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4"
        >
          <Shield className="w-4 h-4 mr-2" />
          Terug naar Admin Paneel
        </Button>
      </div>
      <UserDashboard />
    </div>
  );
};

export default DashboardView;
