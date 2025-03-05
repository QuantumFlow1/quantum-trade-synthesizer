
import React from 'react';
import * as THREE from 'three';
import { useThemeDetection } from '@/hooks/use-theme-detection';

export const TradingFloorEnvironment: React.FC = () => {
  const theme = useThemeDetection();
  
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#111827' : '#f3f4f6'} 
          roughness={0.8}
        />
      </mesh>
      
      {/* Main trading desk */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[10, 1, 4]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#1e293b' : '#e2e8f0'} 
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        
        {/* Screens on desk */}
        {[-3, 0, 3].map((x, i) => (
          <group key={i} position={[x, 1.5, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2, 1.5, 0.1]} />
              <meshStandardMaterial 
                color={theme === 'dark' ? '#0f172a' : '#0f172a'} 
                emissive={theme === 'dark' ? '#1e40af' : '#3b82f6'}
                emissiveIntensity={0.5}
              />
            </mesh>
            <mesh position={[0, -1, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.2, 0.5, 8]} />
              <meshStandardMaterial 
                color={theme === 'dark' ? '#334155' : '#94a3b8'} 
                metalness={0.7}
              />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Surrounding trading desks */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <group key={i} position={[Math.sin(angle) * 12, 0, Math.cos(angle) * 12]} rotation={[0, -angle + Math.PI/2, 0]}>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[6, 1, 3]} />
              <meshStandardMaterial 
                color={theme === 'dark' ? '#1e293b' : '#e2e8f0'} 
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
            
            {/* Screens on surrounding desks */}
            {[-1.5, 1.5].map((x, j) => (
              <group key={j} position={[x, 1.5, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[1.5, 1.2, 0.1]} />
                  <meshStandardMaterial 
                    color="#0f172a" 
                    emissive={theme === 'dark' ? '#1e40af' : '#3b82f6'}
                    emissiveIntensity={0.3}
                  />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}
      
      {/* Large wall display */}
      <mesh position={[0, 6, -15]} castShadow>
        <boxGeometry args={[20, 8, 0.5]} />
        <meshStandardMaterial 
          color="#0f172a" 
          emissive={theme === 'dark' ? '#4f46e5' : '#6366f1'}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};
