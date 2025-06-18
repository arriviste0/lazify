
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { InteractiveAgentInfo } from "@/types/agent";
import Slide from "./Slide";
import { cn } from "@/lib/utils";

interface FullViewportScrollSliderProps {
  agents: InteractiveAgentInfo[];
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const FullViewportScrollSlider: React.FC<FullViewportScrollSliderProps> = ({ agents }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"], // Pin the section while scrolling through its height
  });

  const totalSlides = agents.length + 1; // +1 for the intro slide

  // Horizontal scroll: X goes from 0% to -N*100% where N is number of agent slides
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${agents.length * 100}%`]);

  const [activeGlobalSlideIndex, setActiveGlobalSlideIndex] = useState(0);

  useEffect(() => {
    // This effect updates the active slide index based on scroll progress.
    // It's primarily for the navigation dots.
    // The actual slide transitions and animations are driven by scrollYProgress directly.
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const newActiveSlide = Math.min(totalSlides - 1, Math.floor(latest * totalSlides));
      if (newActiveSlide !== activeGlobalSlideIndex) {
        setActiveGlobalSlideIndex(newActiveSlide);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, totalSlides, activeGlobalSlideIndex]);


  return (
    <div ref={scrollContainerRef} className="relative" style={{ height: `${totalSlides * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden"> {/* This makes the slider section sticky */}
        <motion.div
          className="flex h-full" // Horizontal track for all slides
          style={{ x, width: `${totalSlides * 100}vw` }} // Width is sum of all slides
        >
          {/* Intro Slide */}
          <div 
            className={cn(
              "relative h-screen w-screen flex-shrink-0 flex items-center justify-center text-center p-8 overflow-hidden",
              "bg-gradient-to-br from-primary/20 via-background/50 to-accent/20"
            )}
          >
            <div className="absolute inset-0 animated-background-subtle opacity-[0.03] pointer-events-none"></div>
            <motion.div
              className="relative z-10 max-w-2xl flex flex-col items-center"
              variants={contentVariants}
              initial="hidden"
              animate={activeGlobalSlideIndex === 0 ? "visible" : "hidden"}
            >
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground gradient-text-animated"
              >
                Meet Your AI Workforce
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-muted-foreground"
              >
                Scroll down to discover intelligent agents ready to transform your productivity.
              </motion.p>
            </motion.div>
          </div>

          {/* Agent Slides */}
          {agents.map((agent, index) => (
            <Slide 
              key={agent.id} 
              agent={agent} 
              slideIndex={index + 1} // 0 is intro, so agent slides start at 1
              totalSlides={totalSlides}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </motion.div>

        {/* Progress Dots */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <motion.div
              key={`dot-${index}`}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors duration-300 cursor-pointer",
                activeGlobalSlideIndex === index ? "bg-primary scale-125" : "bg-muted-foreground/50 hover:bg-muted-foreground/70"
              )}
              animate={{
                scale: activeGlobalSlideIndex === index ? 1.25 : 1,
                backgroundColor: activeGlobalSlideIndex === index ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.5)",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const targetScroll = (index / totalSlides) * scrollContainerRef.current.scrollHeight;
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullViewportScrollSlider;
