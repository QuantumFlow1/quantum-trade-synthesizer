
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { useThemeDetection } from '@/hooks/use-theme-detection';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { EnvironmentSelector } from './EnvironmentSelector';
import { TradingFloorEnvironment } from './environments/TradingFloorEnvironment';
import { OfficeTowerEnvironment } from './environments/OfficeTowerEnvironment';
import { FinancialGardenEnvironment } from './environments/FinancialGardenEnvironment';
import { CommandCenterEnvironment } from './environments/CommandCenterEnvironment';
import { EducationalCampusEnvironment } from './environments/EducationalCampusEnvironment';
import { PersonalOfficeEnvironment } from './environments/PersonalOfficeEnvironment';
import { TradingHubEnvironment } from './environments/TradingHubEnvironment';
import { ThemeBasedLighting } from '../3d/ThemeBasedLighting';

export const VirtualEnvironment: React.FC = () => {
  const theme = useThemeDetection();
  const { selectedEnvironment } = useEnvironment();
  const [key, setKey] = React.useState(0);
  
  // Remount canvas when environment changes
  React.useEffect(() => {
    setKey(prev => prev + 1);
  }, [selectedEnvironment]);
  
  const renderEnvironment = () => {
    switch (selectedEnvironment) {
      case 'trading-floor':
        return <TradingFloorEnvironment />;
      case 'office-tower':
        return <OfficeTowerEnvironment />;
      case 'financial-garden':
        return <FinancialGardenEnvironment />;
      case 'command-center':
        return <CommandCenterEnvironment />;
      case 'educational-campus':
        return <EducationalCampusEnvironment />;
      case 'personal-office':
        return <PersonalOfficeEnvironment />;
      case 'trading-hub':
        return <TradingHubEnvironment />;
      default:
        return <TradingFloorEnvironment />;
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-white/10">
      <EnvironmentSelector />
      
      <Canvas
        key={key}
        shadows
        camera={{ position: [0, 5, 14], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true 
        }}
      >
        <ThemeBasedLighting />
        
        {/* Stars for dark theme only */}
        {theme === 'dark' && (
          <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />
        )}
        
        {/* Render the selected environment */}
        {renderEnvironment()}
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          rotateSpeed={0.5}
          zoomSpeed={0.7}
          minDistance={5}
          maxDistance={30}
        />
        
        <Environment preset={theme === "dark" ? "night" : "sunset"} />
      </Canvas>
      
      <div className="absolute bottom-2 left-2 text-xs text-white/50">
        <span>Drag to rotate • Scroll to zoom • Select environment to change</span>
      </div>
    </div>
  );
};
