
import React from 'react';
import * as THREE from 'three';
import { useThemeDetection } from '@/hooks/use-theme-detection';

export const PersonalOfficeEnvironment: React.FC = () => {
  const theme = useThemeDetection();
  
  return (
    <group>
      {/* Office floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#27272a' : '#f4f4f5'} 
          roughness={0.8}
        />
      </mesh>
      
      {/* Office walls */}
      {/* Back wall */}
      <mesh position={[0, 5, -10]} castShadow>
        <boxGeometry args={[20, 10, 0.3]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#18181b' : '#e4e4e7'} 
          roughness={0.9}
        />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[10, 5, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[20, 10, 0.3]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#18181b' : '#e4e4e7'} 
          roughness={0.9}
        />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[20, 10, 0.3]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#18181b' : '#e4e4e7'} 
          roughness={0.9}
        />
      </mesh>
      
      {/* Desk */}
      <group position={[0, 0, -5]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[8, 0.2, 3]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#44403c' : '#d6d3d1'} 
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
        
        {/* Desk legs */}
        <mesh position={[-3.5, 0.5, -1.2]} castShadow>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#44403c' : '#d6d3d1'} 
            metalness={0.3}
          />
        </mesh>
        <mesh position={[3.5, 0.5, -1.2]} castShadow>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#44403c' : '#d6d3d1'} 
            metalness={0.3}
          />
        </mesh>
        <mesh position={[-3.5, 0.5, 1.2]} castShadow>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#44403c' : '#d6d3d1'} 
            metalness={0.3}
          />
        </mesh>
        <mesh position={[3.5, 0.5, 1.2]} castShadow>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#44403c' : '#d6d3d1'} 
            metalness={0.3}
          />
        </mesh>
      </group>
      
      {/* Computer setup */}
      <group position={[0, 1.6, -5]}>
        {/* Main monitor */}
        <mesh position={[0, 1, -0.5]} castShadow>
          <boxGeometry args={[5, 3, 0.1]} />
          <meshStandardMaterial 
            color="#0f172a" 
            emissive={theme === 'dark' ? '#6366f1' : '#818cf8'}
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Monitor stand */}
        <mesh position={[0, 0, -0.5]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#52525b' : '#a1a1aa'} 
            metalness={0.7}
          />
        </mesh>
        
        {/* Keyboard */}
        <mesh position={[0, 0, 0.5]} castShadow>
          <boxGeometry args={[3, 0.1, 1]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#18181b' : '#e4e4e7'} 
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      </group>
      
      {/* Office chair */}
      <group position={[0, 0, -2]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2, 0.2, 2]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#1e40af' : '#3b82f6'} 
            roughness={0.7}
          />
        </mesh>
        
        {/* Chair back */}
        <mesh position={[0, 2, -1]} castShadow>
          <boxGeometry args={[2, 3, 0.2]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#1e40af' : '#3b82f6'} 
            roughness={0.7}
          />
        </mesh>
        
        {/* Chair base */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[1, 1, 0.2, 16]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#27272a' : '#a1a1aa'} 
            metalness={0.5}
          />
        </mesh>
      </group>
      
      {/* Achievement wall / Trophy case */}
      <group position={[-7, 1, -9]}>
        <mesh position={[0, 3, 0]} castShadow>
          <boxGeometry args={[5, 6, 0.5]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#292524' : '#fef3c7'} 
            roughness={0.7}
          />
        </mesh>
        
        {/* Shelves */}
        {[1, 3, 5].map((y) => (
          <mesh key={y} position={[0, y, 0.3]} castShadow>
            <boxGeometry args={[4.5, 0.1, 0.8]} />
            <meshStandardMaterial 
              color={theme === 'dark' ? '#44403c' : '#d6d3d1'} 
              metalness={0.2}
            />
          </mesh>
        ))}
        
        {/* Trophy items */}
        {[1, 3, 5].map((y) => (
          <group key={`trophies-${y}`}>
            {[-1.5, 0, 1.5].map((x, i) => (
              <mesh key={i} position={[x, y + 0.5, 0.3]} castShadow>
                <cylinderGeometry args={[0.2, 0.4, 1, 16]} />
                <meshStandardMaterial 
                  color={theme === 'dark' ? '#fcd34d' : '#fbbf24'} 
                  metalness={0.9}
                  roughness={0.1}
                  emissive={theme === 'dark' ? '#f59e0b' : '#fcd34d'}
                  emissiveIntensity={0.3}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
};
