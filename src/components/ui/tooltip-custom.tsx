
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, HelpCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface OnboardingTooltipProps {
  id: string;
  title: string;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  highlight?: boolean;
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
  onNext?: () => void;
  showNext?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function OnboardingTooltip({
  id,
  title,
  content,
  position = "top",
  highlight = false,
  children,
  className,
  onDismiss,
  onNext,
  showNext = false,
  isOpen,
  onOpenChange,
}: OnboardingTooltipProps) {
  const [open, setOpen] = useState(isOpen || false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen !== undefined ? isOpen : open} onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>
          <div className={cn(
            "relative",
            highlight && "ring-2 ring-primary/50 rounded-md ring-offset-background ring-offset-2",
            className
          )}>
            {children}
            {highlight && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-xs text-white">
                <HelpCircle className="w-4 h-4" />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={position}
          className="p-0 max-w-xs bg-popover border border-border shadow-md" 
          sideOffset={8}
        >
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{title}</h4>
              {onDismiss && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onDismiss}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{content}</div>
            {showNext && (
              <div className="flex justify-end pt-2">
                <Button variant="default" size="sm" className="h-7 text-xs" onClick={onNext}>
                  <span>Volgende</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
