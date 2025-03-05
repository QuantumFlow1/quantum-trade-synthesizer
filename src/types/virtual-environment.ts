
export type EnvironmentType = 
  | 'trading-floor'
  | 'office-tower'
  | 'financial-garden'
  | 'command-center'
  | 'educational-campus'
  | 'personal-office'
  | 'trading-hub';

export interface VirtualEnvironment {
  id: EnvironmentType;
  name: string;
  description: string;
  thumbnailIcon: React.ElementType;
  theme?: 'dark' | 'light';
}
