
import { Search, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onVerify: () => void;
}

const QuickActions = ({ onVerify }: QuickActionsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Snelle Acties</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onVerify}>
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
  );
};

export default QuickActions;
