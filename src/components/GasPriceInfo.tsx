
import React, { useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useGasPriceStore from "../stores/useGasPriceStore";
import { LocalGasStation } from "lucide-react";

interface GasPriceInfoProps {
  showTooltip?: boolean;
  refreshInterval?: number;
}

const GasPriceInfo: React.FC<GasPriceInfoProps> = ({ 
  showTooltip = false, 
  refreshInterval = 60000 
}) => {
  const { standardGasPrice, fastGasPrice, fetchGasPrices, lastFetched } = useGasPriceStore();
  const fetchRef = useRef(fetchGasPrices);

  // Update the ref when fetchGasPrices changes
  useEffect(() => {
    fetchRef.current = fetchGasPrices;
  }, [fetchGasPrices]);

  // Effect to fetch gas prices periodically
  useEffect(() => {
    const handleFetch = () => {
      // Fetch if prices are not available or if the data is older than refreshInterval
      if (!standardGasPrice || !fastGasPrice || Date.now() - lastFetched > refreshInterval) {
        fetchRef.current();
      }
    };

    handleFetch(); // Fetch on component mount
    const intervalId = setInterval(handleFetch, refreshInterval);
    return () => clearInterval(intervalId); // Clean up
  }, [standardGasPrice, fastGasPrice, lastFetched, refreshInterval]);

  // Component displaying gas prices or loading state
  const gasInfo = (
    <div className="flex items-center cursor-pointer mr-4">
      <LocalGasStation className="text-gray-600 mr-2 h-4 w-4" />
      <span className="mr-2">ETH Gas:</span>
      <span className="font-bold">
        {standardGasPrice ? `${standardGasPrice} Gwei` : "Loading..."}
      </span>
    </div>
  );

  // Only show tooltip if both showTooltip and gas prices are available
  const shouldShowTooltip = showTooltip && standardGasPrice && fastGasPrice;

  return (
    <>
      {shouldShowTooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {gasInfo}
            </TooltipTrigger>
            <TooltipContent>
              <p>Standard: {standardGasPrice} Gwei | Fast: {fastGasPrice} Gwei</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        gasInfo
      )}
    </>
  );
};

export default GasPriceInfo;
