
'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Folder, Bot, FileText, MessageSquare, Users, Settings, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const IconContainer = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-card p-3.5 shadow-lg transition-all hover:scale-105 hover:shadow-primary/30 hover:border-primary/70",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
IconContainer.displayName = "IconContainer";

const AiWorkflowVisualization = () => {
  const iconSize = "h-7 w-7 text-primary";
  const beamDuration = 2.5;
  const beamStagger = 0.2;

  const positions = {
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    topLeft: { top: '10%', left: '10%' },
    topRight: { top: '10%', left: '90%', transform: 'translateX(-100%)' },
    midLeft: { top: '50%', left: '0%', transform: 'translateY(-50%)' },
    midRight: { top: '50%', left: '100%', transform: 'translate(-100%, -50%)' },
    bottomLeft: { top: '90%', left: '10%', transform: 'translateY(-100%)' },
    bottomRight: { top: '90%', left: '90%', transform: 'translate(-100%, -100%)' },
  };

  // outerIconPos are the coordinates for the surrounding icons in the 100x100 SVG viewBox
  const icons = [
    { id: 'gdrive', IconComponent: Folder, pos: positions.topLeft, name: "Google Drive", outerIconPos: { x: 18, y: 18 } },
    { id: 'notion', IconComponent: FileText, pos: positions.midLeft, name: "Notion", outerIconPos: { x: 8, y: 50 } },
    { id: 'whatsapp', IconComponent: MessageSquare, pos: positions.bottomLeft, name: "WhatsApp", outerIconPos: { x: 18, y: 82 } },
    { id: 'gdocs', IconComponent: Users, pos: positions.topRight, name: "Google Docs", outerIconPos: { x: 82, y: 18 } },
    { id: 'zapier', IconComponent: Settings, pos: positions.midRight, name: "Zapier", outerIconPos: { x: 92, y: 50 } },
    { id: 'messenger', IconComponent: ExternalLink, pos: positions.bottomRight, name: "Messenger", outerIconPos: { x: 82, y: 82 } },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.3, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  };

  return (
    <motion.div
      className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Central Icon */}
      <motion.div
        style={{ position: 'absolute', ...positions.center }}
        variants={itemVariants}
      >
        <IconContainer className="h-20 w-20 border-2 border-primary shadow-xl shadow-primary/30">
          <Bot className="h-10 w-10 text-primary" />
        </IconContainer>
      </motion.div>

      {/* Surrounding Icons */}
      {icons.map((item) => (
        <motion.div
          key={item.id}
          style={{ position: 'absolute', ...item.pos }}
          variants={itemVariants}
        >
          <IconContainer aria-label={item.name}>
            <item.IconComponent className={iconSize} />
          </IconContainer>
        </motion.div>
      ))}

      {/* SVG for Beams */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsla(var(--primary), 0)" />
            <stop offset="50%" stopColor="hsla(var(--primary), 0.8)" />
            <stop offset="100%" stopColor="hsla(var(--primary), 0)" />
          </linearGradient>
        </defs>

        {icons.map((item, index) => {
          const startX = item.outerIconPos.x;
          const startY = item.outerIconPos.y;
          const endX = 50; // Center of the SVG viewBox
          const endY = 50; // Center of the SVG viewBox

          // Adjusted control point calculation for varied curves ending at the center
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          const dx = endX - startX;
          const dy = endY - startY;
          const spreadFactor = 0.3; // Controls how much the curve deviates

          // Perpendicular offsets for control points
          let offsetX = dy * spreadFactor;
          let offsetY = -dx * spreadFactor;

          // Vary offset direction based on index to avoid all curves bending the same way
          if (index % 3 === 1) {
            offsetX = -offsetX * 0.7; // Different magnitude/direction
            offsetY = -offsetY * 0.7;
          } else if (index % 3 === 2) {
             offsetX *= 0.5; // Shorter curve
             offsetY *= 0.5;
          }
          
          const controlX = midX + offsetX;
          const controlY = midY + offsetY;
          
          const pathD = `M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`;

          return (
            <g key={`beam-${item.id}`}>
              <motion.path // Background track
                d={pathD}
                stroke="hsl(var(--border))"
                strokeOpacity={0.2}
                strokeWidth="0.3"
                fill="none"
                variants={itemVariants}
              />
              <motion.path
                d={pathD}
                stroke="url(#beamGradient)"
                strokeWidth="0.7"
                fill="none"
                strokeLinecap="butt" // Changed from "round" to "butt"
                initial={{ pathLength: 0, pathOffset: 0.5, opacity: 0 }} 
                animate={{ pathLength: 1, pathOffset: -0.5, opacity: [0, 1, 1, 0] }} 
                transition={{
                  duration: beamDuration,
                  delay: 0.5 + index * beamStagger,
                  repeat: Infinity,
                  repeatType: 'loop',
                  repeatDelay: icons.length * beamStagger,
                  ease: 'linear',
                  opacity: { times: [0, 0.1, 0.9, 1], duration: beamDuration }
                }}
              />
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
};

export default AiWorkflowVisualization;
