
import * as THREE from "three";

export const CoordinateSystem = () => {
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
  
  return (
    <group>
      <gridHelper args={[30, 30, "#304050", "#203040"]} position={[0, -3, 0]} />
      
      {/* X-axis */}
      <line geometry={xAxisGeometry}>
        <lineBasicMaterial attach="material" color="#4a9eff" linewidth={2} />
      </line>
      
      {/* Y-axis */}
      <line geometry={yAxisGeometry}>
        <lineBasicMaterial attach="material" color="#ff4a4a" linewidth={2} />
      </line>
    </group>
  );
};
