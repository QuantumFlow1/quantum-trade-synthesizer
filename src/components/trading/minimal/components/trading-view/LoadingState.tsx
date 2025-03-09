
import { Loader } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border">
      <div className="flex flex-col items-center">
        <Loader className="h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Loading market data...</p>
      </div>
    </div>
  );
};
