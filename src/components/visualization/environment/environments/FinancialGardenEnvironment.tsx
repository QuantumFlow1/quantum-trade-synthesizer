import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThemeDetection } from '@/hooks/use-theme-detection';
import { useVideoTexture } from '@react-three/drei';
import { useThemeString } from '@/hooks/useThemeString';

interface FinancialGardenEnvironmentProps {
  videoSrc?: string;
}

export const FinancialGardenEnvironment: React.FC<FinancialGardenEnvironmentProps> = ({ videoSrc }) => {
  const theme = useThemeString();
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  
  // Video texture setup when video source is provided
  const hasVideo = !!videoSrc;
  
  // Video texture creation
  useEffect(() => {
    if (!hasVideo) return;
    
    // Create video element
    const video = document.createElement('video');
    video.src = videoSrc;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    
    // Store ref to video element
    videoElementRef.current = video;
    
    // Create texture
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    
    // Store ref to texture
    videoTextureRef.current = texture;
    
    // Register with context manager if available
    if ((window as any).__registerVideoTexture) {
      const unregister = (window as any).__registerVideoTexture(video);
      
      // Play the video
      video.play().catch(e => console.warn("Could not autoplay video:", e));
      
      return () => {
        if (unregister) unregister();
        video.pause();
        texture.dispose();
      };
    } else {
      // Still try to play even if not registered
      video.play().catch(e => console.warn("Could not autoplay video:", e));
      
      return () => {
        video.pause();
        texture.dispose();
      };
    }
  }, [hasVideo, videoSrc]);
  
  return (
    <group>
      {/* Garden floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#064e3b' : '#d1fae5'} 
          roughness={1}
        />
      </mesh>
      
      {/* Central pond */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#0c4a6e' : '#bae6fd'} 
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      
      {/* Video display surface if video is provided */}
      {hasVideo && videoTextureRef.current && (
        <mesh position={[0, 5, -15]} scale={[16, 9, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={videoTextureRef.current} side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
      )}
      
      {/* Data plants/trees */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * Math.PI) / 6;
        const radius = 12;
        const height = 2 + Math.random() * 5;
        return (
          <group key={i} position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}>
            {/* Trunk */}
            <mesh position={[0, height / 2, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.3, height, 8]} />
              <meshStandardMaterial 
                color={theme === 'dark' ? '#7c2d12' : '#c2410c'} 
                roughness={1}
              />
            </mesh>
            
            {/* Foliage / Data visualization */}
            <mesh position={[0, height, 0]} castShadow>
              <sphereGeometry args={[1 + Math.random(), 8, 8]} />
              <meshStandardMaterial 
                color={(() => {
                  // Random color from a garden palette
                  const colors = theme === 'dark' 
                    ? ['#15803d', '#14532d', '#0f766e', '#0e7490'] 
                    : ['#86efac', '#4ade80', '#34d399', '#2dd4bf'];
                  return colors[Math.floor(Math.random() * colors.length)];
                })()}
                emissive={theme === 'dark' ? '#4ade80' : '#15803d'}
                emissiveIntensity={0.2}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Zen garden pattern */}
      {Array.from({ length: 5 }).map((_, i) => {
        return (
          <mesh 
            key={i} 
            rotation={[-Math.PI / 2, 0, Math.PI * (i / 10)]} 
            position={[0, -0.3, 0]} 
            receiveShadow
          >
            <torusGeometry args={[10 + i * 1.5, 0.3, 16, 100]} />
            <meshStandardMaterial 
              color={theme === 'dark' ? '#f5f5f4' : '#e7e5e4'} 
              roughness={1}
            />
          </mesh>
        );
      })}
      
      {/* Meditation platform */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3, 0.5, 32]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#1c1917' : '#d6d3d1'} 
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};
