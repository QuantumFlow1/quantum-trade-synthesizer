
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackToAdminButtonProps {
  onClick: () => void;
  className?: string;
}

export const BackToAdminButton: React.FC<BackToAdminButtonProps> = ({ onClick, className = "" }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`mb-2 ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Admin
    </Button>
  );
};
