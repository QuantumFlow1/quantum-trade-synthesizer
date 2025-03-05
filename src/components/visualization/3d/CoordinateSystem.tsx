
import * as THREE from "three";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface CoordinateSystemProps {
  theme: ColorTheme;
}

export const CoordinateSystem = ({ theme }: CoordinateSystemProps) => {
  // Create buffer geometries for lines
  const xAxisPoints = [
    new THREE.Vector3(-15, -3, 0),
    new THREE.Vector3(15, -3, 0)
  ];
  
  const yAxisPoints = [
    new THREE.Vector3(0, -3, 0),
    new THREE.Vector3(0, 7, 0)
  ];
  
  const xAxisGeometry = new THREE.BufferGeometry().setFromPoints(xAxisPoints);
  const yAxisGeometry = new THREE.BufferGeometry().setFromPoints(yAxisPoints);
  
  // Theme-based colors
  const xAxisColor = theme === 'dark' ? "#4a9eff" : "#1d4ed8";
  const yAxisColor = theme === 'dark' ? "#ff4a4a" : "#dc2626";
  const gridColor1 = theme === 'dark' ? "#304050" : "#e5e7eb";
  const gridColor2 = theme === 'dark' ? "#203040" : "#d1d5db";
  
  return (
    <group>
      <gridHelper args={[30, 30, gridColor1, gridColor2]} position={[0, -3, 0]} />
      
      {/* X-axis */}
      <line geometry={xAxisGeometry}>
        <lineBasicMaterial attach="material" color={xAxisColor} linewidth={2} />
      </line>
      
      {/* Y-axis */}
      <line geometry={yAxisGeometry}>
        <lineBasicMaterial attach="material" color={yAxisColor} linewidth={2} />
      </line>
    </group>
  );
};
