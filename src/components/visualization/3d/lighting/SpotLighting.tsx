
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface SpotLightingProps {
  theme: ColorTheme;
}

export const SpotLighting = ({ theme }: SpotLightingProps) => {
  const spotLightRef = useRef<THREE.SpotLight>(null!);
  const spotLightTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  
  // Initialize spot light target
  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.target = spotLightTargetRef.current;
    }
  }, []);
  
  // Animate the spotlight
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (spotLightRef.current) {
      // Rotating spot light
      spotLightRef.current.position.x = Math.sin(t * 0.2) * 15;
      spotLightRef.current.position.z = Math.cos(t * 0.2) * 15;
      spotLightTargetRef.current.position.x = Math.sin(t * 0.2 + Math.PI) * 5;
      spotLightTargetRef.current.position.z = Math.cos(t * 0.2 + Math.PI) * 5;
    }
  });
  
  return (
    <>
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
      <primitive object={spotLightTargetRef.current} />
    </>
  );
};
