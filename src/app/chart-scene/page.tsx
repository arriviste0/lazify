"use client"

import { useRef, Suspense, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, Text, OrbitControls } from "@react-three/drei"
import { Vector3, type Mesh, MathUtils } from "three"

// Bar component for the chart
const Bar = ({ position, height, color, label, index, total }) => {
  const meshRef = useRef<Mesh>(null)
  const initialScale = useMemo(() => new Vector3(0.5, 0.01, 0.5), []); // Start almost flat
  const targetScale = useMemo(() => new Vector3(0.5, height, 0.5), [height]);
  const animationProgress = useRef(0); // To track animation state

  useFrame(({ clock }, delta) => {
    if (meshRef.current && animationProgress.current < 1) {
      const delay = index * 0.3; // Stagger animation
      const effectiveTime = Math.max(0, clock.getElapsedTime() - delay);
      animationProgress.current = Math.min(1, effectiveTime * 1.5); // Adjust speed

      // Smooth interpolation for scale.y
      meshRef.current.scale.y = MathUtils.lerp(initialScale.y, targetScale.y, MathUtils.smoothstep(animationProgress.current, 0, 1));

      // Set position based on current scale
      meshRef.current.position.y = meshRef.current.scale.y / 2;
    } else if (meshRef.current) {
        // Subtle hover bob after initial animation
        meshRef.current.position.y = height / 2 + Math.sin(clock.getElapsedTime() * 0.8 + index) * 0.08;
    }
  })

  // Center bars horizontally
  const barGroupPosition = useMemo(() => [
      position[0] - ((total - 1) / 2) * 1.2 + index * 1.2,
      position[1],
      position[2]
    ], [position, index, total]);


  return (
    <group position={barGroupPosition}>
      <mesh ref={meshRef} scale={initialScale} castShadow receiveShadow> {/* Added shadows */}
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Label below bar */}
      <Text
        position={[0, -0.5, 0.6]}
        fontSize={0.3}
        color="#e0e0e0" // Lighter grey for better contrast on dark bg
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Regular.ttf"
      >
        {label}
      </Text>

      {/* Percentage value above bar */}
       <Float speed={1} rotationIntensity={0} floatIntensity={0.1}>
         <Text
            position={[0, height + 0.5, 0]}
            fontSize={0.45} // Slightly larger
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Geist-Bold.ttf"
            outlineWidth={0.02}
            outlineColor="#000000"
         >
           {`${Math.round(height * 20)}%`} {/* Assuming max height represents 50%*2 = 100% */}
         </Text>
       </Float>
    </group>
  )
}

// Floating particle for decoration - kept similar
const FloatingParticle = ({ position, size = 0.1, color = "#a855f7" }) => { // Default purple
  const meshRef = useRef<Mesh>(null)
  const initialPosition = useMemo(() => new Vector3(...position), [position]);
  const randomFactor = useMemo(() => Math.random() * 0.5 + 0.5, []);
  const randomPhase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime() * randomFactor;
      meshRef.current.position.x = initialPosition.x + Math.sin(time * 0.5 + randomPhase) * 0.3;
      meshRef.current.position.y = initialPosition.y + Math.cos(time * 0.3 + randomPhase * 0.5) * 0.4; // Slightly more Y movement
      meshRef.current.position.z = initialPosition.z + Math.sin(time * 0.2 + randomPhase * 0.8) * 0.3;
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={size}>
       <icosahedronGeometry args={[1, 0]} />
       <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} roughness={0.6}/>
    </mesh>
  )
}

// Main chart scene
const ChartScene = () => {
  const chartData = useMemo(() => [
    { label: "Before", height: 1.5, color: "#4f4f4f" }, // Darker Grey
    { label: "After", height: 3.5, color: "#a855f7" }, // Vibrant Purple
  ], []);

  const particles = useMemo(() => Array(15)
    .fill(null)
    .map((_, i) => ({
      position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 8 - 2], // Adjusted range
      size: Math.random() * 0.08 + 0.04, // Slightly smaller particles
      color: ["#a855f7", "#c084fc", "#8b5cf6"][Math.floor(Math.random() * 3)],
    })), []);

  return (
    <>
      <ambientLight intensity={0.3} color="#a855f7" /> {/* Dim purple ambient */}
       <directionalLight
          position={[5, 8, 5]}
          intensity={0.8}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024} // Improve shadow quality
          shadow-mapSize-height={1024}
        />
       <pointLight position={[-5, -3, 4]} intensity={0.5} color="#c084fc" /> {/* Fill light */}


      {/* Chart title */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text
          position={[0, 4.5, 0]} // Positioned higher
          fontSize={0.7}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist-Bold.ttf"
          outlineWidth={0.03}
          outlineColor="#101010" // Dark outline
        >
          Productivity Boost
        </Text>
      </Float>

      {/* Chart bars */}
      <group position={[0, -1, 0]}> {/* Lower the bars slightly */}
        {chartData.map((item, index) => (
          <Bar
            key={index}
            position={[0, 0, 0]}
            height={item.height}
            color={item.color}
            label={item.label}
            index={index}
            total={chartData.length}
          />
        ))}
      </group>

      {/* Decorative particles */}
      {particles.map((particle, i) => (
        <FloatingParticle key={i} {...particle} />
      ))}

       {/* Darker Environment */}
      <Environment preset="night" blur={0.7} />

       {/* Ground plane to receive shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.5}/>
      </mesh>


      {/* Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3.5} // Allow looking down a bit more
        maxPolarAngle={Math.PI / 1.8} // Restrict looking up too high
        minAzimuthAngle={-Math.PI / 6} // Limit horizontal rotation
        maxAzimuthAngle={Math.PI / 6}
        rotateSpeed={0.4}
        autoRotate // Subtle auto-rotation
        autoRotateSpeed={0.3}
      />
    </>
  )
}

// This is the default export for the page
export default function ChartScenePage() {
  // Ensure body has no margin/padding which can interfere with full screen canvas
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden'; // Prevent scrolling on this page

    return () => {
      // Reset styles on unmount if needed elsewhere
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
     // Ensure the container takes full viewport height and has the correct background
    <div className="w-screen h-screen bg-gradient-to-b from-background via-purple-950/40 to-background">
      <Canvas shadows> {/* Enable shadows */}
        <Suspense fallback={null}> {/* Keep Suspense for potential async components */}
          <ChartScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
