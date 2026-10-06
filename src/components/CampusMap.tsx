'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Environment, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// Fallback component in case campus.glb is missing
function FallbackCampus() {
  return (
    <group>
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[100, 1, 100]} />
        <meshStandardMaterial color="#050505" roughness={0.8} />
      </mesh>
      {/* Buildings */}
      <mesh position={[10, 5, -20]} castShadow receiveShadow>
        <boxGeometry args={[15, 10, 15]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[-15, 6, 10]} castShadow receiveShadow>
        <cylinderGeometry args={[8, 8, 12, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[20, 8, 15]} castShadow receiveShadow>
        <boxGeometry args={[10, 16, 10]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 4, -30]} castShadow receiveShadow>
        <boxGeometry args={[20, 8, 10]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[-10, 8, -10]} castShadow receiveShadow>
        <boxGeometry args={[12, 16, 12]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

function CampusModel({ url }: { url: string }) {
  try {
    const { scene } = useGLTF(url);
    
    // Set up OLED-black materials
    useEffect(() => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshStandardMaterial({
            color: '#050505',
            roughness: 0.1,
            metalness: 0.8,
            envMapIntensity: 1,
          });
        }
      });
    }, [scene]);

    return <primitive object={scene} />;
  } catch (error) {
    console.warn("Could not load .glb, using fallback campus model.", error);
    return <FallbackCampus />;
  }
}

interface CampusMapProps {
  targetCoordinates: [number, number, number] | null;
  intent: string | null;
}

export default function CampusMap({ targetCoordinates, intent }: CampusMapProps) {
  const cameraControlsRef = useRef<CameraControls>(null);

  useEffect(() => {
    if (targetCoordinates && cameraControlsRef.current) {
      const [x, y, z] = targetCoordinates;
      // Fly to the coordinates
      cameraControlsRef.current.setLookAt(
        x + 20, y + 20, z + 20, // camera position
        x, y, z, // target position
        true // animate
      );
    }
  }, [targetCoordinates]);

  return (
    <div className="w-full h-full bg-black">
      <Canvas shadows camera={{ position: [50, 50, 50], fov: 45 }}>
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 30, 150]} />
        
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[50, 50, 20]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-20, 20, -20]} intensity={2} color="#4f46e5" />
        <pointLight position={[20, 20, 20]} intensity={2} color="#ec4899" />

        <Environment preset="city" />

        <Suspense fallback={<FallbackCampus />}>
          <CampusModel url="/campus.glb" />
        </Suspense>

        {targetCoordinates && (
          <group position={targetCoordinates}>
            {/* Red Marker */}
            <mesh position={[0, 2, 0]} castShadow>
              <coneGeometry args={[1, 3, 16]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <ringGeometry args={[1, 1.5, 32]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
            
            {/* Label for Intent */}
            {intent && (
              <Html position={[0, 5, 0]} center>
                <div className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/10 text-sm whitespace-nowrap shadow-2xl animate-in fade-in zoom-in duration-300">
                  {intent}
                </div>
              </Html>
            )}
          </group>
        )}

        <CameraControls 
          ref={cameraControlsRef} 
          minDistance={10} 
          maxDistance={150} 
          maxPolarAngle={Math.PI / 2 - 0.05} // don't go below ground
        />
      </Canvas>
    </div>
  );
}
