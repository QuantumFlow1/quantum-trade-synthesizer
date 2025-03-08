
import { MouseEventHandler } from "react";

interface WebGLErrorStateProps {
  type: 'context-lost' | 'error' | 'unsupported';
  onRetry: MouseEventHandler<HTMLButtonElement>;
}

export const WebGLErrorState = ({ type, onRetry }: WebGLErrorStateProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
      <div className="flex flex-col items-center space-y-4 max-w-md text-center p-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`w-16 h-16 ${type === 'unsupported' ? 'text-amber-500' : 'text-destructive'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        
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
