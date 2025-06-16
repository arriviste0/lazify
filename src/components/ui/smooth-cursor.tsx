
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

const DefaultCursorSVG = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: 'translate(-12px, -12px)' }} // Center the SVG on the cursor point
  >
    <circle cx="12" cy="12" r="6" fill="hsl(var(--primary))" opacity="0.8" />
    <circle cx="12" cy="12" r="10" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.5"/>
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
  const cursorRotate = useSpring(0, { damping: 20, stiffness: 200, mass: 0.5 });

  const lastMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
    document.body.style.cursor = 'none';

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      cursorX.set(clientX);
      cursorY.set(clientY);

      const deltaX = clientX - lastMousePosition.current.x;
      const deltaY = clientY - lastMousePosition.current.y;
      lastMousePosition.current = { x: clientX, y: clientY };

      if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        // Add a small offset to rotation to make it feel more natural
        cursorRotate.set(angle + 90);
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
        rotate: cursorRotate,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: isPointerVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
      }}
    >
      {cursor}
    </motion.div>
  );
};

export default SmoothCursor;
