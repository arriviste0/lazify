
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import ModernAgentCard from './ModernAgentCard';
import type { InteractiveAgentInfo } from '@/types/agent';
import { cn } from '@/lib/utils';

interface ModernAgentCarouselProps {
  agents: InteractiveAgentInfo[];
  scrollTargetRef: React.RefObject<HTMLElement>; // Ref to the scrollable section
}

const ModernAgentCarousel: React.FC<ModernAgentCarouselProps> = ({ agents, scrollTargetRef }) => {
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef, // Target the entire scrollable section
    offset: ["start start", "end end"] // Animate from start of section to end of section
  });

  const totalSlides = agents.length;

  // activeSlideIndexDecimal will go from 0 to totalSlides - 1 as user scrolls the section
  const activeSlideIndexDecimal = useTransform(scrollYProgress, [0, 1], [0, totalSlides - 1]);

  return (
    <div className="agent-carousel-track">
      {agents.map((agent, index) => (
        <CarouselItem
          key={agent.id}
          agent={agent}
          index={index}
          activeSlideIndexDecimal={activeSlideIndexDecimal}
          totalSlides={totalSlides}
        />
      ))}
    </div>
  );
};

interface CarouselItemProps {
  agent: InteractiveAgentInfo;
  index: number;
  activeSlideIndexDecimal: MotionValue<number>;
  totalSlides: number;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ agent, index, activeSlideIndexDecimal, totalSlides }) => {
  // Distance of this card from the current "virtual" active slide
  // When card is active, distance is 0. Left: -1, -2... Right: 1, 2...
  const distance = useTransform(activeSlideIndexDecimal, (latest) => index - latest);

  const X_TRANSLATE_FACTOR_PERCENT = 50; // How much horizontal separation for 3D effect
  const Z_TRANSLATE_FACTOR_PIXELS = 250; // How much depth for non-active slides
  const SCALE_FACTOR = 0.2; // How much smaller non-active slides are
  const ROTATE_Y_FACTOR_DEGREES = 20; // How much Y-axis rotation for non-active slides
  const OPACITY_FACTOR = 0.5; // Opacity reduction for non-active slides

  // translateX: cards further from center are pushed out more
  // This creates the "fan" or "stack" effect.
  // A positive distance (card is to the right of active) translates right.
  // A negative distance (card is to the left of active) translates left.
  const translateX = useTransform(distance, (d) => {
    // Give a bit more separation to cards far from center
    return `${d * X_TRANSLATE_FACTOR_PERCENT * (1 + Math.abs(d) * 0.1)}%`;
  });
  
  // scale: active card is 1, others are smaller
  const scale = useTransform(distance, (d) => 1 - Math.abs(d) * SCALE_FACTOR);
  
  // opacity: active card is 1, others are less opaque
  const opacity = useTransform(distance, (d) => Math.max(0.1, 1 - Math.abs(d) * OPACITY_FACTOR));
  
  // rotateY: cards to the left rotate one way, to the right another way
  const rotateY = useTransform(distance, (d) => d * -ROTATE_Y_FACTOR_DEGREES);

  // translateZ: non-active cards are pushed "back"
  const translateZ = useTransform(distance, (d) => -Math.abs(d) * Z_TRANSLATE_FACTOR_PIXELS);

  // zIndex: cards closer to the "active" virtual index are higher
  const zIndex = useTransform(distance, (d) => totalSlides - Math.abs(Math.round(d)));


  return (
    <motion.div
      className="agent-carousel-slide"
      style={{
        translateX, // This will position cards horizontally in the stack
        scale,
        opacity,
        rotateY,
        translateZ, // This pushes cards back or forward in Z space
        zIndex,
        transformOrigin: 'center center', // Ensure transforms originate from center
      }}
    >
      <ModernAgentCard agent={agent} isActive={Math.abs(index - activeSlideIndexDecimal.get()) < 0.5} />
    </motion.div>
  );
};

export default ModernAgentCarousel;
