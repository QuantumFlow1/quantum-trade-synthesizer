
import { MouseEventHandler } from "react";
import { AlertTriangle } from "lucide-react";

interface WebGLErrorStateProps {
  type: 'context-lost' | 'error' | 'unsupported';
  onRetry: MouseEventHandler<HTMLButtonElement>;
}

export const WebGLErrorState = ({ type, onRetry }: WebGLErrorStateProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
      <div className="flex flex-col items-center space-y-4 max-w-md text-center p-6">
        <AlertTriangle 
          className={`w-16 h-16 ${type === 'unsupported' ? 'text-amber-500' : 'text-destructive'}`} 
          aria-hidden="true"
        />
        
        <h3 className="text-lg font-medium">
          {type === 'context-lost' 
            ? "3D Visualization Interrupted" 
            : type === 'unsupported' 
              ? "3D Visualization Not Supported"
              : "Unable to Load 3D Visualization"}
        </h3>
        
        <p className="text-sm text-muted-foreground">
          {type === 'context-lost' 
            ? "The 3D rendering was interrupted. This is often due to browser limitations or memory pressure."
            : type === 'unsupported'
              ? "Your browser or device doesn't fully support WebGL, which is required for 3D visualizations."
              : "There was a problem initializing the 3D visualization. This might be due to browser compatibility or hardware limitations."
          }
        </p>
        
        <div className="flex gap-3 mt-3">
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
            aria-label={
              type === 'context-lost' 
                ? 'Restart visualization' 
                : type === 'unsupported' 
                  ? 'Try anyway' 
                  : 'Retry'
            }
          >
            {type === 'context-lost' ? 'Restart Visualization' : (
              type === 'unsupported' ? 'Try Anyway' : 'Retry'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
