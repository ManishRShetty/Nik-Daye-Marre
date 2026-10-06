'use client';

import { useRef, useEffect, useMemo, useCallback, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Environment, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ErrorBoundary } from './ErrorBoundary';

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

// The campus GLB is exported in real-world units (~11k x 16k) far from the origin.
// We normalize it so its footprint is TARGET_SIZE units on the longest side,
// with its min corner at (0,0,0) so all coordinates are positive.
// Only position/scale are changed — the model geometry itself is untouched.
const TARGET_SIZE = 100;
const GROUND_MARGIN = 12; // extra ground around the campus

type ModelBounds = { center: THREE.Vector3; size: THREE.Vector3 };

function CampusModel({ url, onLoaded }: { url: string; onLoaded?: (bounds: ModelBounds) => void }) {
  const { scene } = useGLTF(url);

  const { model, bounds } = useMemo(() => {
    const root = scene.clone(true);

    // Same look as the reference: glossy near-black buildings
    const material = new THREE.MeshStandardMaterial({
      color: '#0a0a0a',
      roughness: 0.2,
      metalness: 0.8,
      side: THREE.DoubleSide, // meshes are single quads; render both faces
    });

    root.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.material = material;
        // Prevent buildings from vanishing when zoomed in: three.js culls meshes
        // whose bounding sphere it thinks is off-screen. With 296 tiny meshes,
        // drawing all of them is cheap, so just turn culling off.
        mesh.frustumCulled = false;
        mesh.geometry.computeBoundingBox();
        mesh.geometry.computeBoundingSphere();
      }
    });

    // 1) Scale so the longest side of the footprint = TARGET_SIZE
    const wrapper = new THREE.Group();
    wrapper.add(root);
    root.updateMatrixWorld(true);
    const rawSize = new THREE.Box3().setFromObject(root, true).getSize(new THREE.Vector3());
    wrapper.scale.setScalar(TARGET_SIZE / Math.max(rawSize.x, rawSize.z, 1e-6));

    // 2) Measure the *scaled* model precisely, then shift its min corner to the origin
    //    (x: 0 → width, y: 0 → height, z: 0 → depth). No negative axes.
    wrapper.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(wrapper, true);
    wrapper.position.sub(box.min);

    const size = box.getSize(new THREE.Vector3());
    const center = new THREE.Vector3(size.x / 2, 0, size.z / 2);
    return { model: wrapper, bounds: { center, size } };
  }, [scene]);

  useEffect(() => {
    onLoaded?.(bounds);
  }, [bounds, onLoaded]);

  return <primitive object={model} />;
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

  // Default bounds (approx. this campus) until the model reports its real size
  const [bounds, setBounds] = useState<ModelBounds>({
    center: new THREE.Vector3(34, 0, 50),
    size: new THREE.Vector3(68, 4, 100),
  });

  // Once the model is loaded, store its bounds and aim the camera at its center
  const handleModelLoaded = useCallback((b: ModelBounds) => {
    setBounds(b);
    const { center } = b;
    cameraControlsRef.current?.setLookAt(
      center.x + 30, 85, center.z + 115, // camera position (above & in front)
      center.x, 0, center.z,             // look at model center
      false
    );
  }, []);

  const { center: c, size: s } = bounds;

  return (
    <div className="w-full h-full bg-black">
      <Canvas shadows camera={{ position: [c.x + 30, 85, c.z + 115], fov: 45, near: 0.1, far: 2000 }}>
        <color attach="background" args={['#000000']} />

        {/* Ground slab directly under the campus (same style as reference) */}
        <mesh position={[c.x, -0.5, c.z]} receiveShadow>
          <boxGeometry args={[s.x + GROUND_MARGIN * 2, 1, s.z + GROUND_MARGIN * 2]} />
          <meshStandardMaterial color="#050505" roughness={0.8} />
        </mesh>

        {/* Lighting positioned relative to the campus center */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[c.x + 50, 60, c.z + 20]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
        >
          <object3D attach="target" position={[c.x, 0, c.z]} />
        </directionalLight>

        <Environment preset="city" />

        {/* Fallback must be a 3D object: DOM elements can't render inside <Canvas> */}
        <ErrorBoundary fallback={<FallbackCampus />}>
          <Suspense fallback={null}>
            <CampusModel url="/srinivas.glb" onLoaded={handleModelLoaded} />
          </Suspense>
        </ErrorBoundary>

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
          makeDefault
          ref={cameraControlsRef} 
          minDistance={5} 
          maxDistance={400} 
          maxPolarAngle={Math.PI / 2 - 0.05} // don't go below ground
        />
      </Canvas>
    </div>
  );
}
