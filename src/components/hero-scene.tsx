
'use client';

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber"; // Keep core R3F import

// Minimal Scene component for testing
const MinimalScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="purple" />
      </mesh>
    </>
  );
};

// Main component with Canvas
const HeroScene = () => {
  // Use a state to ensure Canvas renders only on the client side after mount
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // This effect runs only on the client after the initial render
    setIsMounted(true);
  }, []);

  return (
     // Use a darker gradient background matching the purple theme
    <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/30 to-background -z-10">
       {/* Conditionally render Canvas only when mounted on the client */}
       {isMounted && (
         <Canvas>
           <Suspense fallback={null}> {/* Suspense is needed for potential async operations within Canvas */}
             <MinimalScene />
           </Suspense>
         </Canvas>
       )}
       {/* Fallback content or styling for SSR/initial load can go here if needed */}
       {!isMounted && (
          <div className="w-full h-full flex items-center justify-center">
             {/* Optional: Add a loading indicator or placeholder */}
             {/* <p className="text-muted-foreground">Loading 3D scene...</p> */}
          </div>
       )}
    </div>
  );
};

export default HeroScene;
