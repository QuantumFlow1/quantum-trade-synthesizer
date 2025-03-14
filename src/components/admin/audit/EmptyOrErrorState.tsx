
import { AlertTriangle } from "lucide-react";

interface EmptyOrErrorStateProps {
  error: string | null;
  isEmpty: boolean;
}

export const EmptyOrErrorState = ({ error, isEmpty }: EmptyOrErrorStateProps) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium">Error</h4>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }
  
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No Audit Logs Found</h3>
        <p className="text-sm text-muted-foreground">
          No transaction audit logs match your current filters
        </p>
      </div>
    );
  }
  
  return null;
};
