
export type OptimizationLevel = 'normal' | 'aggressive' | 'extreme';

export type EnvironmentPreset = 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';

export interface SceneBaseProps {
  optimizationLevel?: OptimizationLevel;
  theme: string;
}
