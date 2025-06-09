"use client";

import type { Mesh } from "three";
import { useRef, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, useProgress } from "@react-three/drei";
import { TextureLoader } from "three";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-lg font-medium">
          Loading Earth... {Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
}

export default function Component() {
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  return (
    <div className="w-full h-[500px] lg:h-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader />}>
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.15} color="#4a90e2" />
          <directionalLight
            position={[5, 3, 5]}
            intensity={1.2}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-5, -3, -5]} intensity={0.3} color="#ff6b6b" />

          {/* Earth with Atmosphere */}
          <Earth />
          <Atmosphere />

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.3}
            minDistance={1.8}
            maxDistance={8}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            panSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Earth() {
  const meshRef = useRef<Mesh>(null);
  const earthTexture = useLoader(TextureLoader, "/assets/3d/texture_earth.jpg");

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[1, 128, 128]} />
      <meshStandardMaterial
        map={earthTexture}
        roughness={0.7}
        metalness={0.1}
        bumpScale={0.05}
        transparent={false}
      />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh scale={[1.02, 1.02, 1.02]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial
        color="#4a90e2"
        transparent={true}
        opacity={0.1}
        side={2}
      />
    </mesh>
  );
}
