
import { LLMExtensions } from "@/components/llm-extensions/LLMExtensions";
import { ApiAccessPanel } from "@/components/dashboard/ApiAccessPanel";
import { AIAdvicePanel } from "@/components/dashboard/AIAdvicePanel";
import { Card } from "@/components/ui/card";

interface AIToolsPageProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
  showApiAccess: boolean;
}

export const AIToolsPage = ({ apiStatus, showApiAccess }: AIToolsPageProps) => {
  return (
    <div className="space-y-6">
      <LLMExtensions />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AIAdvicePanel apiStatus={apiStatus} />
        
        {showApiAccess && (
          <ApiAccessPanel apiStatus={apiStatus} />
        )}
      </div>
    </div>
  );
};
