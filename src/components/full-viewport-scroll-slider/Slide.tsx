
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlideProps {
  agent: InteractiveAgentInfo;
  isActive: boolean;
}

const contentVariants = {
  hidden: { opacity: 0, y: 30 }, 
  visible: {
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
  hidden: { opacity: 0, y: 25 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }, 
};

const getAgentGradient = (themeColorClass: string) => {
  const colorName = themeColorClass.replace('bg-', '').split('-')[0];
  // Adjusted gradient for better visibility and lighter feel
  // Using -700, -800, -900 shades with adjusted opacities
  return `bg-gradient-to-br from-${colorName}-700/30 via-${colorName}-800/20 to-${colorName}-950/25`;
};


const Slide: React.FC<SlideProps> = ({ agent, isActive }) => {
  const slideBackgroundClass = getAgentGradient(agent.themeColorClass);

  return (
    <div className={cn(
        "relative h-screen w-screen flex-shrink-0 flex items-center justify-center text-center p-8 overflow-hidden",
        slideBackgroundClass 
      )}
    >
       <div className="absolute inset-0 animated-background-subtle opacity-[0.04] pointer-events-none"></div>

      <motion.div
        className="relative z-10 max-w-2xl flex flex-col items-center"
        variants={contentVariants}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="text-6xl md:text-7xl mb-6">
          {agent.iconEmoji}
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="mb-8 relative w-56 h-40 sm:w-64 sm:h-48 md:w-80 md:h-60"
        >
          <Image
            src={agent.slideImageUrl || `https://placehold.co/400x300.png?text=${encodeURIComponent(agent.name)}`}
            alt={`${agent.name} visual representation`}
            fill
            className="object-contain rounded-lg shadow-xl"
            data-ai-hint={agent.slideImageHint || agent.name.toLowerCase().replace(/\s+/g, ' ')}
            priority={isActive} 
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
            className="cta-button text-base md:text-lg" 
            asChild
          >
            <Link href={`/interactive-agents/${agent.id}`}>
              Try Demo
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Slide;
