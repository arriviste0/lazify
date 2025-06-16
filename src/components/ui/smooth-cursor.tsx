
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, type SpringOptions } from 'framer-motion';

interface SpringConfig {
  damping: number;
  stiffness: number;
  mass: number;
  restDelta: number;
}

const defaultSpringConfig: SpringConfig = {
  damping: 45,
  stiffness: 400,
  mass: 1,
  restDelta: 0.001,
};

// Updated DefaultCursorSVG to render an arrow
const DefaultCursorSVG = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: 'translate(-2px, -2px) rotate(-45deg)' }} // Adjust transform for arrow pointing
  >
    <path
      d="M4 12L20 12L14 6M14 18L20 12" // Simple line arrow
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="hsl(var(--primary))"
    />
     <path
      d="M4.777 13.266L4.045 4.067L13.243 12.533L4.777 13.266Z"
      fill="hsl(var(--primary))"
      stroke="hsl(var(--primary))"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

interface SmoothCursorProps {
  cursor?: JSX.Element;
  springConfig?: Partial<SpringConfig>;
}

export const SmoothCursor: React.FC<SmoothCursorProps> = ({
  cursor = <DefaultCursorSVG />,
  springConfig: customSpringConfig,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isPointerVisible, setIsPointerVisible] = useState(true);

  const finalSpringConfig = { ...defaultSpringConfig, ...customSpringConfig };

  const cursorX = useSpring(0, finalSpringConfig as SpringOptions);
  const cursorY = useSpring(0, finalSpringConfig as SpringOptions);
  // Rotation logic is kept but the arrow SVG itself is now pre-rotated for a typical cursor appearance
  const cursorRotate = useSpring(0, { damping: 30, stiffness: 300, mass: 0.7 });


  const lastMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
    document.body.style.cursor = 'none';

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      cursorX.set(clientX);
      cursorY.set(clientY);

      // Keep rotation logic if desired, or remove/simplify if the arrow should always point one way
      const deltaX = clientX - lastMousePosition.current.x;
      const deltaY = clientY - lastMousePosition.current.y;
      lastMousePosition.current = { x: clientX, y: clientY };

      if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        cursorRotate.set(angle + 90); // Offset angle for typical cursor orientation
      }
    };

    const handleMouseEnter = () => {
      setIsPointerVisible(true);
    };

    const handleMouseLeave = () => {
      setIsPointerVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, cursorRotate]);

  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: cursorX,
        y: cursorY,
        rotate: cursorRotate, // Apply dynamic rotation
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: isPointerVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
      }}
    >
      {/*
        The SVG itself is designed to point upwards.
        The motion.div's rotate style (driven by cursorRotate) handles the dynamic direction.
        The SVG's internal transform is to correct its own default orientation if needed.
      */}
      {React.cloneElement(cursor, {
         style: { transform: 'translate(-3px, -3px)' } // Centering for the new arrow SVG
      })}
    </motion.div>
  );
};

export default SmoothCursor;
