
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlideProps {
  agent: InteractiveAgentInfo;
  slideIndex: number; // Index of this slide within all slides (0 = intro, 1 = first agent, etc.)
  totalSlides: number;
  scrollYProgress: MotionValue<number>; // Overall scroll progress of the parent container
}

const contentVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.6, -0.05, 0.01, 0.99],
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 25, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const getAgentGradient = (themeColorClass: string) => {
  const colorName = themeColorClass.replace('bg-', '').split('-')[0];
  // Brighter, more thematic gradients ensuring visibility
  return `bg-gradient-to-br from-${colorName}-600/40 via-${colorName}-700/30 to-background/60`;
};


const Slide: React.FC<SlideProps> = ({ agent, slideIndex, totalSlides, scrollYProgress }) => {
  const slideBackgroundClass = getAgentGradient(agent.themeColorClass);

  // Calculate the start and end scroll progress for this specific slide's "active" window
  // Each slide (including intro) occupies 1/totalSlides of the scroll progress.
  const slideStartProgress = (slideIndex - 0.5) / totalSlides; // Start animation slightly before fully centered
  const slideEndProgress = (slideIndex + 0.5) / totalSlides;   // End animation slightly after fully centered
  const slideCenterProgress = slideIndex / totalSlides;

  // Dynamic scale for the content wrapper based on scroll progress
  // Content is largest when its slide is centered
  const scale = useTransform(
    scrollYProgress,
    [ (slideIndex - 1) / totalSlides, slideCenterProgress, (slideIndex + 1) / totalSlides ],
    [0.85, 1.05, 0.85], // Min scale, Max scale (when centered), Min scale
    { clamp: true } // Prevents values from going outside the output range
  );

  // Dynamic opacity for the content wrapper
  const opacity = useTransform(
    scrollYProgress,
    [ (slideIndex - 1) / totalSlides, slideCenterProgress, (slideIndex + 1) / totalSlides ],
    [0.5, 1, 0.5],
    { clamp: true }
  );
  
  // Determine if this slide's content should trigger its initial "animate" state
  // This is true when the slide is largely in the viewport center
  const isSlideContentActive = useTransform(scrollYProgress, latest => {
    return latest >= slideStartProgress && latest < slideEndProgress;
  });
  
  // For the initial fade-in/slide-in animations of items (emoji, text, button)
  // We want this to trigger once when the slide is substantially in view.
  const [hasBeenVisible, setHasBeenVisible] = React.useState(false);
  React.useEffect(() => {
    const unsubscribe = isSlideContentActive.on("change", (latestIsActive) => {
      if (latestIsActive && !hasBeenVisible) {
        setHasBeenVisible(true);
      }
    });
    return unsubscribe;
  }, [isSlideContentActive, hasBeenVisible]);


  return (
    <div className={cn(
        "relative h-screen w-screen flex-shrink-0 flex items-center justify-center text-center p-8 overflow-hidden",
        slideBackgroundClass
      )}
    >
       <div className="absolute inset-0 animated-background-subtle opacity-[0.06] pointer-events-none"></div>

      <motion.div
        className="relative z-10 max-w-2xl flex flex-col items-center"
        style={{ scale, opacity }} // Apply dynamic scale and opacity to the whole content block
      >
        <motion.div 
          variants={contentVariants}
          initial="initial"
          animate={hasBeenVisible ? "animate" : "initial"} // Trigger inner animations once
        >
          <motion.div variants={itemVariants} className="text-6xl md:text-7xl mb-6">
            {agent.iconEmoji}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-8 relative w-56 h-40 sm:w-64 sm:h-48 md:w-80 md:h-60 rounded-lg shadow-2xl overflow-hidden"
          >
            <Image
              src={agent.slideImageUrl || `https://placehold.co/400x300.png?text=${encodeURIComponent(agent.name)}`}
              alt={`${agent.name} visual representation`}
              fill
              className="object-contain"
              data-ai-hint={agent.slideImageHint || agent.name.toLowerCase().replace(/\s+/g, ' ')}
              priority={slideIndex < 3} // Prioritize loading for early slides
            />
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground"
          >
            {agent.name}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg"
          >
            {agent.description}
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button
              size="lg"
              className="cta-button text-base md:text-lg" // Uses primary theme color from globals.css
              asChild
            >
              <Link href={`/interactive-agents/${agent.id}`}>
                Try Demo
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Slide;
