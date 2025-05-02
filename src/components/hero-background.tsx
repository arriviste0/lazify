'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Placeholder component for the 3D Hero Background
// Replace this with your actual Three.js/R3F implementation if the error is resolved later

const HeroBackground = () => {
  return (
    <motion.div
      className="absolute inset-0 -z-10 overflow-hidden bg-background animated-background-subtle" // Use subtle gradient animation
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Example: Animated abstract shapes (CSS only for simplicity) */}
       <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl animate-pulse opacity-50"></div>
       <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/5 rounded-full filter blur-3xl animate-pulse animation-delay-[2s] opacity-50"></div>
       <div className="absolute top-1/3 right-1/3 w-56 h-56 bg-secondary/5 rounded-full filter blur-2xl animate-pulse animation-delay-[1s] opacity-40"></div>

      {/* Optional overlay */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-sm"></div>
    </motion.div>
  );
};

export default HeroBackground;
