
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
  children: React.ReactNode;
}

export const CollapsibleSection = ({
  title,
  isExpanded,
  onToggle,
  className = "",
  children,
}: CollapsibleSectionProps) => {
  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={onToggle}
      className={className}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <CollapsibleTrigger className="p-1 hover:bg-secondary/20 rounded-full">
          {isExpanded ? 
            <ChevronUp className="h-5 w-5" /> : 
            <ChevronDown className="h-5 w-5" />
          }
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};
