
'use client';

import React, { useRef, Suspense, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber"; // Ensure only necessary imports are used
import { Environment, Float, Text, PerspectiveCamera } from "@react-three/drei";
import { Vector3, Color, type Mesh, type Group, MathUtils, SphereGeometry, IcosahedronGeometry, MeshPhongMaterial } from "three"; // Import necessary Three.js classes
import { useIsMobile } from "@/hooks/use-mobile";

// Floating Icon component
const FloatingIcon = ({ position, icon, color, speed = 1, amplitude = 0.2 }: { position: [number, number, number]; icon: string; color: string; speed?: number; amplitude?: number }) => {
  const groupRef = useRef<Group>(null);
  const initialY = position[1];
  const randomRotationOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const isClientMobile = useIsMobile(); // Use hook inside component

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime() * speed;
      groupRef.current.position.y = initialY + Math.sin(time) * amplitude;
      // Add subtle rotation
      groupRef.current.rotation.y = Math.sin(time * 0.3 + randomRotationOffset) * 0.3;
      groupRef.current.rotation.x = Math.cos(time * 0.2 + randomRotationOffset) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Using Drei Text for potentially better handling */}
       <Text fontSize={isClientMobile ? 1.2 : 1.5} color={color} anchorX="center" anchorY="middle" font="/fonts/Geist-Bold.ttf">
         {icon}
       </Text>
    </group>
  );
};

// Floating Particle component
const FloatingParticle = ({ position, size = 0.2, color = '#8b5cf6', speed = 1 }: { position: [number, number, number]; size?: number; color?: string; speed?: number }) => {
  const meshRef = useRef<Mesh>(null);
  const initialPosition = useMemo(() => new Vector3(...position), [position]);
  // Randomize movement patterns slightly
  const randomFactor = useMemo(() => Math.random() + 0.5, []);
  const randomPhase = useMemo(() => Math.random() * Math.PI * 2, []);


  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime() * speed * randomFactor;
       // More complex, less synchronized movement
      meshRef.current.position.x = initialPosition.x + Math.sin(time * 0.5 + randomPhase) * 0.4;
      meshRef.current.position.y = initialPosition.y + Math.cos(time * 0.3 + randomPhase * 0.5) * 0.5;
      meshRef.current.position.z = initialPosition.z + Math.sin(time * 0.2 + randomPhase * 0.8) * 0.3;

      // Subtle scale pulse
      const scalePulse = 1 + Math.sin(time * 1.5 + randomPhase) * 0.05;
      meshRef.current.scale.set(scalePulse, scalePulse, scalePulse);
    }
  });

  // Use IcosahedronGeometry for particles
  const geometry = useMemo(() => new IcosahedronGeometry(1, 0), []);
  // Use MeshStandardMaterial for better lighting interaction
  const material = useMemo(() => new MeshStandardMaterial({
     color: color,
     emissive: color,
     emissiveIntensity: 0.6,
     metalness: 0.1,
     roughness: 0.4
  }), [color]);


  return (
    <mesh ref={meshRef} position={position} scale={size} geometry={geometry} material={material}>
       {/* Geometry and Material are now memoized and passed as props */}
    </mesh>
  );
};

// Main Scene component
const Scene = () => {
  const isClientMobile = useIsMobile(); // Use hook inside component

  // Icons and particles - Adjusted positions and colors for purple theme
  const icons = useMemo(() => [
    { position: [-4, 1.5, -2.5], icon: "✉️", color: "#c084fc", speed: 0.8, amplitude: 0.25 }, // Lighter Purple
    { position: [4, 2.5, -1.5], icon: "📊", color: "#a78bfa", speed: 1.2, amplitude: 0.3 }, // Violet
    { position: [-2, 3.5, -3.5], icon: "🤖", color: "#818cf8", speed: 1, amplitude: 0.2 },   // Indigo
    { position: [3, 0.5, -2], icon: "📝", color: "#f472b6", speed: 0.9, amplitude: 0.25 }, // Pink (contrast)
  ] as const, []); // Added 'as const' for better type inference if needed

   const particles = useMemo(() => Array(isClientMobile ? 15 : 25) // Fewer particles on mobile
    .fill(null)
    .map((_, i) => ({
      position: [(Math.random() - 0.5) * (isClientMobile ? 8 : 12), (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6 - 3] as [number, number, number],
      size: (Math.random() * 0.1 + 0.05) * (isClientMobile ? 0.8 : 1), // Smaller on mobile
      color: ["#a855f7", "#c084fc", "#8b5cf6", "#7c3aed"][Math.floor(Math.random() * 4)], // Purple shades
      speed: Math.random() * 0.4 + 0.4,
    })), [isClientMobile]);


  // State for mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

   // Camera rig to follow mouse slightly
  const CameraRig = () => {
    useFrame((state, delta) => {
      // Lerp camera position towards target based on mouse
      state.camera.position.lerp(new Vector3(mousePosition.x * 0.5, mousePosition.y * 0.3 + 1, 10), delta * 1.5); // Added +1 to Y for slightly higher default view
      state.camera.lookAt(0, 1, 0); // Look towards the center area slightly above origin
    });
    return null;
  };


  return (
    <>
      {/* Setup Perspective Camera */}
      <PerspectiveCamera makeDefault position={[0, 1, 10]} fov={isClientMobile ? 70 : 55} near={0.1} far={100}/>
      {/* Apply Camera Rig for mouse movement */}
      <CameraRig />

      {/* Lighting Setup */}
      <ambientLight intensity={0.4} color="#a855f7" /> {/* Purple ambient light */}
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-10, -5, 5]} intensity={0.4} color="#c084fc" /> {/* Additional purple light */}
      <directionalLight position={[0, 5, 5]} intensity={0.3} color="#ffffff" />

      {/* Floating icons */}
      {icons.map((iconProps, i) => (
        // Use Float for automatic floating animation
        <Float key={`icon-${i}`} speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
          <FloatingIcon {...iconProps} />
        </Float>
      ))}

      {/* Particles */}
      {particles.map((particleProps, i) => (
        <FloatingParticle key={`particle-${i}`} {...particleProps} />
      ))}

       {/* Use a softer environment preset */}
       <Environment preset="sunset" blur={0.6} />
    </>
  );
};

// Main component with Canvas
const HeroScene = () => {
  // Use a state to ensure Canvas renders only on the client side after mount
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
     // Use a darker gradient background matching the purple theme
    <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/30 to-background -z-10">
       {/* Conditionally render Canvas only when mounted */}
       {isMounted && (
         <Canvas>
           <Suspense fallback={null}>
             <Scene />
           </Suspense>
         </Canvas>
       )}
    </div>
  );
};

export default HeroScene;
