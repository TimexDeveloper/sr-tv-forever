import { Canvas } from "@react-three/fiber";
import { Text3D, Center, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";

const Logo3D = () => {
  const meshRef = useRef<Mesh>(null);

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <Center>
        <Text3D
          ref={meshRef}
          font="/fonts/helvetiker_bold.typeface.json"
          size={2.5}
          height={0.5}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          SrTV
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={512}
            transmission={1}
            roughness={0.2}
            thickness={1.5}
            ior={1.5}
            chromaticAberration={0.5}
            anisotropy={1}
            color="#00f5ff"
            emissive="#00f5ff"
            emissiveIntensity={2}
          />
        </Text3D>
      </Center>
    </Float>
  );
};

export const Background3D = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        className="bg-gradient-to-b from-background via-background/95 to-background/90"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bd00ff" />
        <Logo3D />
      </Canvas>
      
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="w-full h-1 bg-primary animate-scanline" />
      </div>
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'var(--gradient-cyber)',
          mixBlendMode: 'screen',
          opacity: 0.1
        }}
      />
    </div>
  );
};
