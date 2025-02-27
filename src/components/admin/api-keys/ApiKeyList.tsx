
import React from "react";
import { Switch } from "@/components/ui/switch";
import { ApiKey } from "./types";
import { useApiKeyUtils } from "./useApiKeyUtils";

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  loading: boolean;
  onStatusChange: (id: string, isActive: boolean) => void;
}

export const ApiKeyList: React.FC<ApiKeyListProps> = ({ apiKeys, loading, onStatusChange }: ApiKeyListProps) => {
  const { renderApiKeyMasked, getKeyTypeName } = useApiKeyUtils();

  if (loading) {
    return <div className="text-center py-4">Loading API keys...</div>;
  }

  if (apiKeys.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No API keys found.</div>;
  }

  return (
    <div className="space-y-4">
      {apiKeys.map(key => (
        <div key={key.id} className="p-4 border rounded-md flex justify-between items-center">
          <div>
            <h3 className="font-medium">{getKeyTypeName(key.key_type)}</h3>
            <p className="text-sm text-muted-foreground">
              {renderApiKeyMasked(key.api_key)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={key.is_active} 
              onCheckedChange={(checked) => onStatusChange(key.id, checked)}
            />
            <span className="text-sm">
              {key.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
