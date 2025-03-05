
import React from 'react';
import * as THREE from 'three';
import { useThemeDetection } from '@/hooks/use-theme-detection';

export const TradingHubEnvironment: React.FC = () => {
  const theme = useThemeDetection();
  
  return (
    <group>
      {/* Hub floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <circleGeometry args={[20, 36]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#1f2937' : '#f9fafb'} 
          roughness={0.8}
        />
      </mesh>
      
      {/* Central visualization */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 5, 0]} castShadow>
          <sphereGeometry args={[4, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#0f172a" 
            emissive={theme === 'dark' ? '#6366f1' : '#818cf8'}
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Base platform */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[6, 6, 1, 32]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#0f172a' : '#e2e8f0'} 
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
      </group>
      
      {/* Trading booths in a circle */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const radius = 12;
        return (
          <group key={i} position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]} rotation={[0, -angle + Math.PI, 0]}>
            {/* Booth */}
            <mesh position={[0, 2, 0]} castShadow>
              <boxGeometry args={[4, 4, 3]} />
              <meshStandardMaterial 
                color={theme === 'dark' ? '#075985' : '#bae6fd'} 
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
            
            {/* Entrance */}
            <mesh position={[0, 1.5, 1.55]} castShadow>
              <boxGeometry args={[2, 3, 0.1]} />
              <meshStandardMaterial 
                color={theme === 'dark' ? '#0c4a6e' : '#0ea5e9'} 
                transparent
                opacity={0.7}
                metalness={0.5}
              />
            </mesh>
            
            {/* Interior desk */}
            <mesh position={[0, 1, -0.5]} castShadow>
              <boxGeometry args={[3, 0.2, 1.5]} />
              <meshStandardMaterial 
                color={theme === 'dark' ? '#0f172a' : '#1e293b'} 
                metalness={0.2}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Community board */}
      <group position={[0, 0, -18]}>
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[15, 8, 0.5]} />
          <meshStandardMaterial 
            color="#020617" 
            emissive={theme === 'dark' ? '#2563eb' : '#60a5fa'}
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Stand */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[3, 1, 3]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#0f172a' : '#e2e8f0'} 
            metalness={0.4}
          />
        </mesh>
      </group>
      
      {/* Ambient decorative elements */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * Math.PI) / 6;
        const radius = 18;
        return (
          <group key={i} position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}>
            {/* Columns */}
            <mesh position={[0, 5, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.5, 10, 8]} />
              <meshStandardMaterial 
                color={theme === 'dark' ? '#334155' : '#94a3b8'} 
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
            
            {/* Light elements */}
            <mesh position={[0, 7, 0]} castShadow>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial 
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
