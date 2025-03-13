
import React, { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bitcoin } from "lucide-react";

interface NextHalvingInfoProps {
  showTooltip?: boolean;
}

const NextHalvingInfo: React.FC<NextHalvingInfoProps> = ({ showTooltip = false }) => {
  // This would typically come from a store, API or calculation
  // Hardcoded for demonstration
  const daysUntilHalving = 121;
  const remainingBlocks = 7200;
  const blockTimeInSeconds = 602;
  const halvingDate = "April 2024";
  
  const formatBlockTime = (blockTimeInSeconds: number | null) => {
    if (blockTimeInSeconds === null) {
      return "N/A";
    }
    const blockTimeInMinutes = Math.floor(blockTimeInSeconds / 60);
    const blockTimeSeconds = Math.floor(blockTimeInSeconds % 60);
    return `${blockTimeInMinutes}:${blockTimeSeconds < 10 ? '0' : ''}${blockTimeSeconds}`;
  };
  
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
              <p>Remaining Blocks: {remainingBlocks}</p>
              <p>Block Time: {formatBlockTime(blockTimeInSeconds)} mins</p>
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
