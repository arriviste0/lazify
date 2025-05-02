'use client';

import { useRef, Suspense, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber"; // Removed extend
import { Environment, Float, Text, PerspectiveCamera, Html } from "@react-three/drei";
import { Vector3, Color, type Mesh, type Group, MathUtils, SphereGeometry, IcosahedronGeometry, MeshPhongMaterial } from "three"; // Import necessary Three.js classes
import { useIsMobile } from "@/hooks/use-mobile";

// Floating Icon component
const FloatingIcon = ({ position, icon, color, speed = 1, amplitude = 0.2 }) => {
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
const FloatingParticle = ({ position, size = 0.2, color = '#8b5cf6', speed = 1 }) => {
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

  return (
    <mesh ref={meshRef} position={position} scale={size}> {/* Apply size via scale */}
       <icosahedronGeometry args={[1, 0]} /> {/* Smoother sphere */}
       <meshStandardMaterial
         color={color}
         emissive={color}
         emissiveIntensity={0.6}
         metalness={0.1}
         roughness={0.4}
       />
    </mesh>
  );
};

// Main Scene component
const Scene = () => {
  const isClientMobile = useIsMobile(); // Use hook inside component

  // Icons and particles - Adjusted positions and colors for purple theme
  const icons = [
    { position: [-4, 1.5, -2.5], icon: "✉️", color: "#c084fc", speed: 0.8, amplitude: 0.25 }, // Lighter Purple
    { position: [4, 2.5, -1.5], icon: "📊", color: "#a78bfa", speed: 1.2, amplitude: 0.3 }, // Violet
    { position: [-2, 3.5, -3.5], icon: "🤖", color: "#818cf8", speed: 1, amplitude: 0.2 },   // Indigo
    { position: [3, 0.5, -2], icon: "📝", color: "#f472b6", speed: 0.9, amplitude: 0.25 }, // Pink (contrast)
  ];

   const particles = useMemo(() => Array(isClientMobile ? 15 : 25) // Fewer particles on mobile
    .fill(null)
    .map((_, i) => ({
      position: [(Math.random() - 0.5) * (isClientMobile ? 8 : 12), (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6 - 3],
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
      state.camera.position.lerp(new Vector3(mousePosition.x * 0.5, mousePosition.y * 0.3, 10), delta * 1.5);
      state.camera.lookAt(0, 1, 0); // Look towards the center area slightly above origin
    });
    return null;
  };


  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 10]} fov={isClientMobile ? 70 : 55} near={0.1} far={100}/>
      <CameraRig />

      <ambientLight intensity={0.4} color="#a855f7" /> {/* Purple ambient light */}
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-10, -5, 5]} intensity={0.4} color="#c084fc" /> {/* Additional purple light */}
      <directionalLight position={[0, 5, 5]} intensity={0.3} color="#ffffff" />

      {/* Floating icons */}
      {icons.map((icon, i) => (
        <Float key={`icon-${i}`} speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
          <FloatingIcon {...icon} />
        </Float>
      ))}

      {/* Particles */}
      {particles.map((particle, i) => (
        <FloatingParticle key={`particle-${i}`} {...particle} />
      ))}

       {/* Use a softer environment */}
       <Environment preset="sunset" blur={0.6} />
    </>
  );
};

// Main component with Canvas
const HeroScene = () => {
  return (
     // Use a darker gradient background matching the purple theme
    <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/30 to-background -z-10">
      <Canvas>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
