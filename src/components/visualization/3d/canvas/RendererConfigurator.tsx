
import { useThree } from "@react-three/fiber";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { useEffect, useRef } from "react";

interface RendererConfiguratorProps {
  theme: ColorTheme;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
  onRendererReady: () => void;
}

export const RendererConfigurator = ({
  theme,
  onCanvasReady,
  onRendererReady
}: RendererConfiguratorProps) => {
  const { gl } = useThree();
  const configuredRef = useRef(false);
  
  useEffect(() => {
    if (gl && !configuredRef.current) {
      try {
        // Set clear color based on theme
        gl.setClearColor(theme === 'dark' ? '#0a0a14' : '#f0f4f8', 1);
        
        // Set pixel ratio (limiting to 1.5 for performance)
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        gl.setPixelRatio(pixelRatio);
        
        // Store reference to the canvas
        if (gl.domElement) {
          onCanvasReady(gl.domElement);
        }
        
        // Configure additional WebGL parameters for stability
        if (gl.getContext) {
          // Only try to enable features if webgl context is accessible via getContext
          gl.enable(gl.DEPTH_TEST);
          gl.depthFunc(gl.LEQUAL);
          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
        
        configuredRef.current = true;
        console.log("3D Canvas initialized successfully");
        
        // Notify parent that renderer is ready
        setTimeout(() => {
          onRendererReady();
        }, 50);
      } catch (e) {
        console.error("Error configuring WebGL context:", e);
        // Don't let this crash the component - we'll handle gracefully
      }
    }
  }, [gl, theme, onCanvasReady, onRendererReady]);
  
  return null;
};
