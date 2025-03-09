
import React from 'react';
import * as THREE from 'three';
import { useThemeString } from '@/hooks/use-theme-string';

export const OfficeTowerEnvironment: React.FC = () => {
  const theme = useThemeString();
  
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#1e293b' : '#f1f5f9'} 
          roughness={0.8}
        />
      </mesh>
      
      {/* Office windows/walls */}
      <group position={[0, 10, -20]}>
        <mesh castShadow>
          <boxGeometry args={[40, 20, 0.5]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#0f172a' : '#e2e8f0'} 
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
        
        {/* Window frames */}
        {Array.from({ length: 8 }).map((_, i) => (
          <group key={i} position={[(i - 3.5) * 5, 0, 0.3]}>
            <mesh castShadow>
              <boxGeometry args={[4, 18, 0.1]} />
              <meshStandardMaterial 
                color={theme === 'dark' ? '#0ea5e9' : '#7dd3fc'} 
                transparent
                opacity={0.3}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            
            {/* Window dividers */}
            {Array.from({ length: 3 }).map((_, j) => (
              <mesh key={j} position={[0, (j - 1) * 6, 0]} castShadow>
                <boxGeometry args={[4.2, 0.2, 0.2]} />
                <meshStandardMaterial 
                  color={theme === 'dark' ? '#334155' : '#94a3b8'} 
                  metalness={0.8}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      
      {/* Conference table */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[12, 0.2, 5]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#1e293b' : '#cbd5e1'} 
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>
        
        {/* Table support */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[10, 1, 3]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#334155' : '#94a3b8'} 
            metalness={0.3}
          />
        </mesh>
        
        {/* Chairs around table */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const radius = 4;
          return (
            <group key={i} position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]} rotation={[0, -angle + Math.PI, 0]}>
              <mesh position={[0, 0.7, 0]} castShadow>
                <boxGeometry args={[1, 0.1, 1]} />
                <meshStandardMaterial 
                  color={theme === 'dark' ? '#1e40af' : '#3b82f6'} 
                />
              </mesh>
              <mesh position={[0, 1.5, -0.5]} castShadow>
                <boxGeometry args={[1, 1.5, 0.1]} />
                <meshStandardMaterial 
                  color={theme === 'dark' ? '#1e40af' : '#3b82f6'} 
                />
              </mesh>
            </group>
          );
        })}
      </group>
      
      {/* Presentation screen */}
      <mesh position={[0, 5, -15]} castShadow>
        <boxGeometry args={[15, 8, 0.2]} />
        <meshStandardMaterial 
          color="#0f172a" 
          emissive={theme === 'dark' ? '#2563eb' : '#60a5fa'}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};
