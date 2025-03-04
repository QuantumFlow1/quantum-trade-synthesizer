
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface QuickLinksProps {
  isAdmin: boolean;
}

export const QuickLinks: React.FC<QuickLinksProps> = ({ isAdmin }) => {
  if (!isAdmin) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Link to="/admin/users">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Gebruikers</span>
        </Button>
      </Link>
    </div>
  );
};
