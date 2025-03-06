
import { useMemo } from "react";
import { ColorTheme } from "@/hooks/use-theme-detection";
import * as THREE from "three";

interface CoordinatesAndStarsProps {
  theme: ColorTheme;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  optimizationLevel?: 'normal' | 'aggressive';
}

export const CoordinatesAndStars = ({ 
  theme, 
  sentiment,
  optimizationLevel = 'normal' 
}: CoordinatesAndStarsProps) => {
  // Configure the grid color based on theme
  const gridColor = theme === 'dark' ? '#6366f1' : '#4f46e5';
  
  // Generate stars based on market sentiment - this creates a starfield effect
  const stars = useMemo(() => {
    // Skip stars generation in aggressive optimization mode
    if (optimizationLevel === 'aggressive') {
      return null;
    }
    
    const starsCount = 200;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);
    const starsSizes = new Float32Array(starsCount);
    
    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      starsPositions[i3] = (Math.random() - 0.5) * 100;
      starsPositions[i3 + 1] = Math.random() * 50 + 5; // Above the chart
      starsPositions[i3 + 2] = (Math.random() - 0.5) * 100;
      
      // Vary star sizes based on sentiment
      if (sentiment === 'bullish') {
        starsSizes[i] = Math.random() * 0.5 + 0.5; // Larger stars for bullish
      } else if (sentiment === 'bearish') {
        starsSizes[i] = Math.random() * 0.3 + 0.2; // Smaller stars for bearish
      } else {
        starsSizes[i] = Math.random() * 0.4 + 0.3; // Medium stars for neutral
      }
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));
    
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.5,
      sizeAttenuation: true,
      color: theme === 'dark' ? '#a5b4fc' : '#6366f1',
      transparent: true,
      opacity: 0.8
    });
    
    return (
      <points>
        <primitive object={starsGeometry} attach="geometry" />
        <primitive object={starsMaterial} attach="material" />
      </points>
    );
  }, [theme, sentiment, optimizationLevel]);
  
  return (
    <>
      {/* Coordinate grid */}
      <gridHelper 
        args={[100, 20, gridColor, gridColor]} 
        position={[0, -0.48, 0]}
        rotation={[0, 0, 0]}
      />
      
      {/* Stars background */}
      {stars}
    </>
  );
};
