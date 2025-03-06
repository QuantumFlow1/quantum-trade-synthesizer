
import { useState, useEffect } from "react";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const ThemeBasedLighting = () => {
  const theme = useThemeDetection();
  const [intensity, setIntensity] = useState(0);
  
  // Smoothly transition light intensity when theme changes
  useEffect(() => {
    setIntensity(theme === 'dark' ? 0.2 : 0.5);
  }, [theme]);

  // Create refs for animatable lights
  const directionalLightRef = useState(() => new THREE.DirectionalLight())[0];
  const pointLightRef = useState(() => new THREE.PointLight())[0];
  const spotLightRef = useState(() => new THREE.SpotLight())[0];
  
  // Animate lights
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Subtle movement for directional light
    directionalLightRef.position.x = Math.sin(t * 0.1) * 10;
    directionalLightRef.position.z = Math.cos(t * 0.1) * 10;
    
    // Pulsing effect for point light
    const pulseIntensity = (Math.sin(t * 0.5) * 0.2 + 0.8);
    pointLightRef.intensity = theme === 'dark' ? 0.6 * pulseIntensity : 0.3 * pulseIntensity;
    
    // Rotating spot light
    spotLightRef.position.x = Math.sin(t * 0.2) * 15;
    spotLightRef.position.z = Math.cos(t * 0.2) * 15;
    spotLightRef.target.position.x = Math.sin(t * 0.2 + Math.PI) * 5;
    spotLightRef.target.position.z = Math.cos(t * 0.2 + Math.PI) * 5;
  });
  
  return (
    <>
      {/* Ambient light - overall scene illumination */}
      <ambientLight 
        intensity={theme === 'dark' ? 0.2 : 0.5} 
        color={theme === 'dark' ? "#1a1a2e" : "#ffffff"} 
      />
      
      {/* Main directional light - simulates sunlight */}
      <primitive
        object={directionalLightRef}
        position={[5, 10, 5]}
        intensity={theme === 'dark' ? 0.6 : 1.2}
        color={theme === 'dark' ? "#a78bfa" : "#ffffff"}
        castShadow
      />
      
      {/* Accent point light - adds color and atmosphere */}
      <primitive
        object={pointLightRef}
        position={[0, 5, -5]}
        color={theme === 'dark' ? "#4f46e5" : "#7dd3fc"}
        distance={25}
      />
      
      {/* Spotlight for dramatic effects */}
      <primitive
        object={spotLightRef}
        position={[10, 15, 0]}
        angle={0.3}
        penumbra={0.8}
        intensity={theme === 'dark' ? 0.5 : 0.2}
        color={theme === 'dark' ? "#8b5cf6" : "#6d28d9"}
        distance={30}
        decay={2}
        castShadow
      />
      <primitive object={spotLightRef.target} position={[0, 0, 0]} />
      
      {/* Fill light to balance shadows */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={theme === 'dark' ? 0.3 : 0.5}
        color={theme === 'dark' ? "#9ca3af" : "#f3f4f6"}
      />
    </>
  );
};
