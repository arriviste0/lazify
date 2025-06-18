
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
  const distance = useTransform(activeSlideIndexDecimal, (latest) => index - latest);

  const X_TRANSLATE_FACTOR_PERCENT = 15; 
  const Z_TRANSLATE_FACTOR_PIXELS = 80; 
  const SCALE_FACTOR = 0.1; 
  const ROTATE_Y_FACTOR_DEGREES = 8;
  const OPACITY_FACTOR = 0.25;

  const translateX = useTransform(distance, (d) => {
    return `${d * X_TRANSLATE_FACTOR_PERCENT}%`;
  });
  
  const scale = useTransform(distance, (d) => 1 - Math.abs(d) * SCALE_FACTOR);
  const opacity = useTransform(distance, (d) => Math.max(0.1, 1 - Math.abs(d) * OPACITY_FACTOR));
  const rotateY = useTransform(distance, (d) => d * -ROTATE_Y_FACTOR_DEGREES);
  const translateZ = useTransform(distance, (d) => -Math.abs(d) * Z_TRANSLATE_FACTOR_PIXELS);
  const zIndex = useTransform(distance, (d) => totalSlides - Math.abs(Math.round(d)));


  return (
    <motion.div
      className="agent-carousel-slide"
      style={{
        translateX,
        scale,
        opacity,
        rotateY,
        translateZ,
        zIndex,
        transformOrigin: 'center center',
      }}
    >
      <ModernAgentCard agent={agent} isActive={Math.abs(index - activeSlideIndexDecimal.get()) < 0.5} />
    </motion.div>
  );
};

export default ModernAgentCarousel;
