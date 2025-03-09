
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { useThemeString } from '@/hooks/use-theme-string';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { EnvironmentSelector } from './EnvironmentSelector';
import { EnvironmentLearningPath } from './learning-path';
import { TradingFloorEnvironment } from './environments/TradingFloorEnvironment';
import { OfficeTowerEnvironment } from './environments/OfficeTowerEnvironment';
import { FinancialGardenEnvironment } from './environments/FinancialGardenEnvironment';
import { CommandCenterEnvironment } from './environments/CommandCenterEnvironment';
import { EducationalCampusEnvironment } from './environments/EducationalCampusEnvironment';
import { PersonalOfficeEnvironment } from './environments/PersonalOfficeEnvironment';
import { TradingHubEnvironment } from './environments/TradingHubEnvironment';
import { ThemeBasedLighting } from '../3d/ThemeBasedLighting';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Globe } from 'lucide-react';
import { WebGLContextManager } from '../3d/canvas/WebGLContextManager';

export const VirtualEnvironment: React.FC<{ videoSrc?: string }> = ({ videoSrc }) => {
  const theme = useThemeString();
  const { selectedEnvironment } = useEnvironment();
  const [key, setKey] = React.useState(0);
  const [activeTab, setActiveTab] = useState<string>("explore");
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  
  // Handle WebGL context events
  const handleContextLost = React.useCallback(() => {
    console.error("VirtualEnvironment: WebGL context lost");
  }, []);
  
  const handleContextRestored = React.useCallback(() => {
    console.log("VirtualEnvironment: WebGL context restored");
  }, []);
  
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
        return <FinancialGardenEnvironment videoSrc={videoSrc} />;
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="absolute top-4 left-4 z-10">
        <TabsList className="bg-black/40 backdrop-blur-sm border-white/10">
          <TabsTrigger value="explore" className="text-white data-[state=active]:bg-primary/30">
            <Globe className="h-4 w-4 mr-2" />
            Explore
          </TabsTrigger>
          <TabsTrigger value="learn" className="text-white data-[state=active]:bg-primary/30">
            <BookOpen className="h-4 w-4 mr-2" />
            Learn
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="explore" className="mt-0 h-full">
          <Canvas
            key={key}
            shadows
            camera={{ position: [0, 5, 14], fov: 50 }}
            gl={{ 
              antialias: true,
              alpha: true,
              preserveDrawingBuffer: true 
            }}
            ref={(canvas) => {
              canvasRef.current = canvas;
            }}
          >
            <WebGLContextManager 
              canvasRef={canvasRef} 
              onContextLost={handleContextLost} 
              onContextRestored={handleContextRestored}
              videoTextureEnabled={true}
            />
            
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
        </TabsContent>
        
        <TabsContent value="learn" className="mt-0 h-full bg-black/80 backdrop-blur-lg overflow-y-auto p-6">
          <EnvironmentLearningPath />
        </TabsContent>
      </Tabs>
    </div>
  );
};
