
import { FC } from "react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm text-muted-foreground">This may take a moment to initialize</p>
    </div>
  );
};
