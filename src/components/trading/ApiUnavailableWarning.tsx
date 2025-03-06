
import { FC } from "react";
import { ApiStatus } from "@/hooks/use-trading-chart-data";

interface ApiUnavailableWarningProps {
  apiStatus: ApiStatus;
  apiKeysAvailable: boolean;
  lastAPICheckTime: Date | null;
  handleRetryConnection: () => void;
}

export const ApiUnavailableWarning: FC<ApiUnavailableWarningProps> = ({
  apiStatus,
  apiKeysAvailable,
  lastAPICheckTime,
  handleRetryConnection
}) => {
  if (apiStatus !== 'unavailable') return null;

  return (
    <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
      <div className="flex items-center">
        <div className="text-yellow-500 mr-2">⚠️</div>
        <div>
          <h3 className="font-medium">Trading Services Unavailable</h3>
          <p className="text-sm text-muted-foreground">
            {!apiKeysAvailable 
              ? "No API keys configured. Please set up API keys in settings or admin panel."
              : "Connection to trading services failed."
            } {lastAPICheckTime && `Last check: ${lastAPICheckTime.toLocaleTimeString()}`}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {!apiKeysAvailable && (
          <button
            onClick={() => document.getElementById('api-keys-config-btn')?.click()}
            className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-md text-sm font-medium text-primary-foreground transition-colors"
          >
            Configure API Keys
          </button>
        )}
        <button
          onClick={handleRetryConnection}
          className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-md text-sm font-medium text-yellow-700 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
};
