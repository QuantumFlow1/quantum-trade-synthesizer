
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bitcoin } from "lucide-react";

interface NextHalvingInfoProps {
  showTooltip?: boolean;
}

const NextHalvingInfo: React.FC<NextHalvingInfoProps> = ({ showTooltip = false }) => {
  // This would typically come from a store, API or calculation
  // Hardcoded for demonstration
  const daysUntilHalving = 121;
  const halvingDate = "April 2024";
  
  const halvingInfo = (
    <div className="flex items-center cursor-pointer">
      <Bitcoin className="text-orange-500 mr-2 h-4 w-4" />
      <span className="mr-1">Next Halving:</span>
      <span className="font-bold">{daysUntilHalving} days</span>
    </div>
  );
  
  return (
    <>
      {showTooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {halvingInfo}
            </TooltipTrigger>
            <TooltipContent>
              <p>Expected Bitcoin halving: {halvingDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        halvingInfo
      )}
    </>
  );
};

export default NextHalvingInfo;
