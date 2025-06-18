
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { InteractiveAgentInfo } from "@/types/agent";
import Slide from "./Slide";
import { cn } from "@/lib/utils";

interface FullViewportScrollSliderProps {
  agents: InteractiveAgentInfo[];
}

const FullViewportScrollSlider: React.FC<FullViewportScrollSliderProps> = ({ agents }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"], // Pin the section while scrolling through it
  });

  // Transform scrollYProgress (0 to 1) to translateX for the horizontal track
  // For N slides, track moves from 0 to -(N-1) * 100vw
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(agents.length - 1) * 100}%`]);

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    // Update active slide based on scrollYProgress
    // This is a simplified way; more precise calculation might involve slide boundaries
    return scrollYProgress.on("change", (latest) => {
      const newActiveSlide = Math.min(agents.length -1, Math.floor(latest * agents.length));
      if (newActiveSlide !== activeSlide) {
        setActiveSlide(newActiveSlide);
      }
    });
  }, [scrollYProgress, agents.length, activeSlide]);


  return (
    <div ref={scrollContainerRef} className="relative" style={{ height: `${agents.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ x, width: `${agents.length * 100}vw` }} // Horizontal track
        >
          {agents.map((agent, index) => (
            <Slide key={agent.id} agent={agent} isActive={index === activeSlide} />
          ))}
        </motion.div>

        {/* Progress Dots */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {agents.map((_, index) => (
            <motion.div
              key={`dot-${index}`}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors duration-300",
                activeSlide === index ? "bg-primary scale-125" : "bg-muted-foreground/50"
              )}
              animate={{
                scale: activeSlide === index ? 1.25 : 1,
                backgroundColor: activeSlide === index ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.5)",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullViewportScrollSlider;
