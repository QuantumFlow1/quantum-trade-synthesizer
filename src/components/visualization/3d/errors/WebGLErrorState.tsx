
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
          className={`w-16 h-16 ${type === 'unsupported' ? 'text-yellow-500' : 'text-destructive'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        
        <p className="text-lg font-medium">
          {type === 'context-lost' 
            ? "WebGL context lost" 
            : type === 'unsupported' 
              ? "WebGL Not Supported"
              : "Unable to load 3D visualization"}
        </p>
        
        <p className="text-sm">
          {type === 'context-lost' 
            ? "The 3D rendering was interrupted. This is often due to GPU memory pressure or driver limitations."
            : type === 'unsupported'
              ? "Your browser or device doesn't support WebGL, which is required for 3D visualizations."
              : "Your browser may not support WebGL, or there might be an issue with your graphics hardware."
          }
        </p>
        
        {type === 'error' && (
          <div className="text-sm mt-2 text-muted-foreground">
            <p>Try these solutions:</p>
            <ul className="list-disc text-left ml-6 mt-2">
              <li>Close other browser tabs and applications</li>
              <li>Update your graphics drivers</li>
              <li>Disable hardware acceleration in your browser settings</li>
              <li>Try a different browser (Chrome or Firefox recommended)</li>
            </ul>
          </div>
        )}
        
        {type === 'unsupported' && (
          <p className="text-sm mt-2">Try using a different browser or updating your graphics drivers.</p>
        )}
        
        <button 
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-md transition-colors"
        >
          {type === 'unsupported' ? 'Try Anyway' : 'Retry with Simplified Settings'}
        </button>
      </div>
    </div>
  );
};
