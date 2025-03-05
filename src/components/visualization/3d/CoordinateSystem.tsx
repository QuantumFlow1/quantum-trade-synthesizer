
import * as THREE from "three";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface CoordinateSystemProps {
  theme: ColorTheme;
}

export const CoordinateSystem = ({ theme }: CoordinateSystemProps) => {
  // Theme-based colors
  const xAxisColor = theme === 'dark' ? "#4a9eff" : "#1d4ed8";
  const yAxisColor = theme === 'dark' ? "#ff4a4a" : "#dc2626";
  const gridColor1 = theme === 'dark' ? "#304050" : "#e5e7eb";
  const gridColor2 = theme === 'dark' ? "#203040" : "#d1d5db";
  
  return (
    <group>
      <gridHelper args={[30, 30, gridColor1, gridColor2]} position={[0, -3, 0]} />
      
      {/* X-axis */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-15, -3, 0, 15, -3, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={xAxisColor} linewidth={2} />
      </line>
      
      {/* Y-axis */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -3, 0, 0, 7, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={yAxisColor} linewidth={2} />
      </line>
    </group>
  );
};
