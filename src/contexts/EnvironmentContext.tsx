
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EnvironmentType, VirtualEnvironment } from '@/types/virtual-environment';
import { useThemeDetection } from '@/hooks/use-theme-detection';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface EnvironmentContextType {
  selectedEnvironment: EnvironmentType;
  setSelectedEnvironment: (environment: EnvironmentType) => void;
  environments: VirtualEnvironment[];
  currentEnvironment: VirtualEnvironment;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
};

export const EnvironmentProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const theme = useThemeDetection();
  const [selectedEnvironment, setSelectedEnvironment] = useLocalStorage<EnvironmentType>(
    'selectedEnvironment', 
    'trading-floor'
  );
  
  const environments: VirtualEnvironment[] = [
    {
      id: 'trading-floor',
      name: 'Modern Trading Floor',
      description: 'A sleek, high-tech trading floor with real-time market visualizations',
      thumbnailIcon: require('lucide-react').BarChart4,
    },
    {
      id: 'office-tower',
      name: 'Virtual Office Tower',
      description: 'Multi-level office with panoramic views of a financial district',
      thumbnailIcon: require('lucide-react').Building2,
    },
    {
      id: 'financial-garden',
      name: 'Financial Garden',
      description: 'A relaxed, nature-inspired space with organic data visualizations',
      thumbnailIcon: require('lucide-react').Leaf,
    },
    {
      id: 'command-center',
      name: 'Digital Command Center',
      description: 'Futuristic command hub with holographic displays and advanced controls',
      thumbnailIcon: require('lucide-react').MonitorPlay,
    },
    {
      id: 'educational-campus',
      name: 'Educational Campus',
      description: 'Learning-focused environment with lecture halls and practice areas',
      thumbnailIcon: require('lucide-react').GraduationCap,
    },
    {
      id: 'personal-office',
      name: 'Customizable Personal Office',
      description: 'Your own space that grows with your trading experience',
      thumbnailIcon: require('lucide-react').Briefcase,
    },
    {
      id: 'trading-hub',
      name: 'Virtual Trading Hub',
      description: 'Social trading space with community features and private consultations',
      thumbnailIcon: require('lucide-react').Users,
    },
  ];
  
  const currentEnvironment = environments.find(env => env.id === selectedEnvironment) || environments[0];
  
  return (
    <EnvironmentContext.Provider value={{
      selectedEnvironment,
      setSelectedEnvironment,
      environments,
      currentEnvironment
    }}>
      {children}
    </EnvironmentContext.Provider>
  );
};
