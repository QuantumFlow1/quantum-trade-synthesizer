
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    </div>
  );
};
