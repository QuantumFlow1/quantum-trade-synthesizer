
import { useState, useEffect, useRef } from "react";
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
  const directionalLightRef = useRef(new THREE.DirectionalLight());
  const pointLightRef = useRef(new THREE.PointLight());
  const spotLightRef = useRef(new THREE.SpotLight());
  
  // Initialize spot light target
  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.target.position.set(0, 0, 0);
    }
  }, []);
  
  // Animate lights
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (directionalLightRef.current) {
      // Subtle movement for directional light
      directionalLightRef.current.position.x = Math.sin(t * 0.1) * 10;
      directionalLightRef.current.position.z = Math.cos(t * 0.1) * 10;
    }
    
    if (pointLightRef.current) {
      // Pulsing effect for point light
      const pulseIntensity = (Math.sin(t * 0.5) * 0.2 + 0.8);
      pointLightRef.current.intensity = theme === 'dark' ? 0.6 * pulseIntensity : 0.3 * pulseIntensity;
    }
    
    if (spotLightRef.current) {
      // Rotating spot light
      spotLightRef.current.position.x = Math.sin(t * 0.2) * 15;
      spotLightRef.current.position.z = Math.cos(t * 0.2) * 15;
      spotLightRef.current.target.position.x = Math.sin(t * 0.2 + Math.PI) * 5;
      spotLightRef.current.target.position.z = Math.cos(t * 0.2 + Math.PI) * 5;
    }
  });
  
  return (
    <>
      {/* Ambient light - overall scene illumination */}
      <ambientLight 
        intensity={theme === 'dark' ? 0.3 : 0.6} 
        color={theme === 'dark' ? "#1a1a2e" : "#ffffff"} 
      />
      
      {/* Main directional light - simulates sunlight */}
      <directionalLight
        ref={directionalLightRef}
        position={[5, 10, 5]}
        intensity={theme === 'dark' ? 0.6 : 1.2}
        color={theme === 'dark' ? "#a78bfa" : "#ffffff"}
        castShadow
      />
      
      {/* Accent point light - adds color and atmosphere */}
      <pointLight
        ref={pointLightRef}
        position={[0, 5, -5]}
        intensity={theme === 'dark' ? 0.5 : 0.3}
        color={theme === 'dark' ? "#4f46e5" : "#7dd3fc"}
        distance={25}
      />
      
      {/* Spotlight for dramatic effects */}
      <spotLight
        ref={spotLightRef}
        position={[10, 15, 0]}
        angle={0.3}
        penumbra={0.8}
        intensity={theme === 'dark' ? 0.5 : 0.2}
        color={theme === 'dark' ? "#8b5cf6" : "#6d28d9"}
        distance={30}
        decay={2}
        castShadow
      />
      
      {/* Fill light to balance shadows */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={theme === 'dark' ? 0.3 : 0.5}
        color={theme === 'dark' ? "#9ca3af" : "#f3f4f6"}
      />
    </>
  );
};
