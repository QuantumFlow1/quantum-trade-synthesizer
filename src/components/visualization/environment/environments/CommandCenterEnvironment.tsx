
import React from 'react';
import * as THREE from 'three';
import { useThemeDetection } from '@/hooks/use-theme-detection';

export const CommandCenterEnvironment: React.FC = () => {
  const theme = useThemeDetection();
  
  return (
    <group>
      {/* Command center floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <circleGeometry args={[20, 36]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#09090b' : '#18181b'} 
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      
      {/* Central platform */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[8, 9, 0.5, 36]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#1e1b4b' : '#3730a3'} 
          roughness={0.5}
          metalness={0.7}
        />
      </mesh>
      
      {/* Command station */}
      <group position={[0, 0.5, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[5, 6, 1, 24]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#0f172a' : '#1e293b'} 
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        
        {/* Holographic projector */}
        <mesh position={[0, 3, 0]} castShadow>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial 
            color="#312e81" 
            emissive={theme === 'dark' ? '#6366f1' : '#818cf8'}
            emissiveIntensity={0.7}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
      
      {/* Control stations surrounding the center */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const radius = 12;
        return (
          <group key={i} position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]} rotation={[0, -angle + Math.PI, 0]}>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[3, 1, 2]} />
              <meshStandardMaterial 
                color={theme === 'dark' ? '#0f172a' : '#1e293b'} 
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>
            
            {/* Control panels */}
            <mesh position={[0, 1.1, -0.7]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
              <boxGeometry args={[2.5, 0.1, 1]} />
              <meshStandardMaterial 
                color="#020617" 
                emissive={(() => {
                  // Random color for each station
                  const colors = theme === 'dark' 
                    ? ['#2563eb', '#7c3aed', '#db2777', '#ea580c'] 
                    : ['#60a5fa', '#a78bfa', '#f472b6', '#fb923c'];
                  return colors[i % colors.length];
                })()}
                emissiveIntensity={0.5}
              />
            </mesh>
            
            {/* Chair */}
            <mesh position={[0, 0.5, 1]} castShadow>
              <boxGeometry args={[1, 0.5, 1]} />
              <meshStandardMaterial 
                color={theme === 'dark' ? '#334155' : '#64748b'} 
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Large curved display wall */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * Math.PI) / 6;
        const radius = 18;
        return (
          <mesh 
            key={i} 
            position={[
              Math.sin(angle) * radius,
              5,
              Math.cos(angle) * radius
            ]} 
            rotation={[0, -angle + Math.PI, 0]}
            castShadow
          >
            <boxGeometry args={[5, 8, 0.5]} />
            <meshStandardMaterial 
              color="#020617" 
              emissive={theme === 'dark' ? '#1e40af' : '#3b82f6'}
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};
