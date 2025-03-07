
import { FC, useEffect, useState } from "react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ 
  message = "Loading..." 
}) => {
  const [dots, setDots] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  
  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 300);
    
    return () => clearInterval(interval);
  }, []);
  
  // Simulate progress percentage (purely cosmetic)
  useEffect(() => {
    if (progressPercent < 100) {
      const timer = setTimeout(() => {
        // Start slow then accelerate
        const increment = progressPercent < 30 ? 1 : 
                         progressPercent < 60 ? 2 : 
                         progressPercent < 90 ? 3 : 1;
                         
        setProgressPercent(prev => Math.min(prev + increment, 100));
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [progressPercent]);
  
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      <p className="text-lg font-medium">{message}{dots}</p>
      <div className="w-48 bg-secondary/50 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-primary h-full rounded-full transition-all ease-out duration-300" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        {progressPercent < 100 ? 
          "Initializing 3D visualization..." : 
          "Almost ready!"}
      </p>
    </div>
  );
};
