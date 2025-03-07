
import { ReactNode } from "react";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface CanvasContainerProps {
  theme: ColorTheme;
  children: ReactNode;
  ref?: React.RefObject<HTMLDivElement>;
}

export const CanvasContainer = ({ 
  theme, 
  children, 
  ref 
}: CanvasContainerProps) => {
  // Background gradients based on theme
  const darkBackground = 'radial-gradient(circle, #1a1a3a 0%, #0f0f23 100%)';
  const lightBackground = 'radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%)';
  
  return (
    <div 
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      style={{ background: theme === 'dark' ? darkBackground : lightBackground }}
    >
      {children}
    </div>
  );
};
