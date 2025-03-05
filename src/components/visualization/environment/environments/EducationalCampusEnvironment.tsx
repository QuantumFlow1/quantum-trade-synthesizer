
import React from 'react';
import * as THREE from 'three';
import { useThemeDetection } from '@/hooks/use-theme-detection';

export const EducationalCampusEnvironment: React.FC = () => {
  const theme = useThemeDetection();
  
  return (
    <group>
      {/* Campus ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#064e3b' : '#dcfce7'} 
          roughness={1}
        />
      </mesh>
      
      {/* Lecture Hall */}
      <group position={[0, 0, -15]}>
        {/* Main building */}
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[20, 10, 15]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#0c4a6e' : '#bae6fd'} 
            roughness={0.7}
          />
        </mesh>
        
        {/* Building entrance */}
        <mesh position={[0, 2, 7.6]} castShadow>
          <boxGeometry args={[6, 4, 0.2]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#0e7490' : '#67e8f9'} 
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        
        {/* Steps */}
        {[0, 1, 2].map((step) => (
          <mesh key={step} position={[0, 0.2 + step * 0.4, 8 + step]} castShadow>
            <boxGeometry args={[8, 0.4, 1]} />
            <meshStandardMaterial 
              color={theme === 'dark' ? '#1e1b4b' : '#c7d2fe'} 
              roughness={0.9}
            />
          </mesh>
        ))}
      </group>
      
      {/* Library Building */}
      <group position={[-15, 0, 0]}>
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[15, 8, 10]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#7c2d12' : '#fed7aa'} 
            roughness={0.8}
          />
        </mesh>
        
        {/* Windows */}
        {[-5, 0, 5].map((x) => (
          <mesh key={x} position={[x, 4, 5.1]} castShadow>
            <boxGeometry args={[3, 6, 0.1]} />
            <meshStandardMaterial 
              color={theme === 'dark' ? '#155e75' : '#a5f3fc'} 
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>
      
      {/* Practice Trading Floor */}
      <group position={[15, 0, 0]}>
        <mesh position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[15, 5, 10]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#1e3a8a' : '#bfdbfe'} 
            roughness={0.6}
          />
        </mesh>
        
        {/* Large glass front */}
        <mesh position={[0, 2.5, 5.1]} castShadow>
          <boxGeometry args={[14, 4, 0.1]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#0c4a6e' : '#bae6fd'} 
            metalness={0.7}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
      
      {/* Central plaza with benches */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, -0.3, 0]} receiveShadow>
          <cylinderGeometry args={[8, 8, 0.3, 32]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#1c1917' : '#fafaf9'} 
            roughness={0.9}
          />
        </mesh>
        
        {/* Benches */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * Math.PI) / 2.5;
          const radius = 6;
          return (
            <group key={i} position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]} rotation={[0, -angle + Math.PI, 0]}>
              <mesh position={[0, 0.3, 0]} castShadow>
                <boxGeometry args={[3, 0.2, 0.8]} />
                <meshStandardMaterial 
                  color={theme === 'dark' ? '#78350f' : '#fef3c7'} 
                  roughness={1}
                />
              </mesh>
              {/* Bench supports */}
              <mesh position={[-1, 0, 0]} castShadow>
                <boxGeometry args={[0.1, 0.6, 0.8]} />
                <meshStandardMaterial 
                  color={theme === 'dark' ? '#57534e' : '#a8a29e'} 
                />
              </mesh>
              <mesh position={[1, 0, 0]} castShadow>
                <boxGeometry args={[0.1, 0.6, 0.8]} />
                <meshStandardMaterial 
                  color={theme === 'dark' ? '#57534e' : '#a8a29e'} 
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};
