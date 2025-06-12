
"use client";

import type React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface Agent {
  name: string;
  description: string;
  hint: string;
  color: string; // Gradient class string e.g., "from-purple-600 to-indigo-600"
  icon: LucideIcon;
  slug: string;
}

interface AgentSectionProps {
  agents: Agent[];
}

// Animation Variants
const frameVariants = {
  hidden: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
    filter: "blur(4px)", // Add blur
  }),
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)", // Remove blur
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.3, ease: "easeOut" },
      scale: { duration: 0.3, ease: "easeOut" },
      filter: { duration: 0.3, ease: "easeOut" },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.8,
    filter: "blur(4px)", // Add blur on exit
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2, ease: "easeIn" },
      scale: { duration: 0.2, ease: "easeIn" },
      filter: { duration: 0.2, ease: "easeIn" },
    },
  }),
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  }),
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateY: 45 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.2,
    },
  },
};

const smallCardVariants = {
  inactive: { scale: 0.9, opacity: 0.6, filter: "grayscale(50%)" },
  active: { scale: 1, opacity: 1, filter: "grayscale(0%)" },
  hover: { scale: 0.95, transition: { duration: 0.2 } },
  tap: { scale: 0.9, transition: { duration: 0.1 } },
};


const AgentSection: React.FC<AgentSectionProps> = ({ agents }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const nextAgent = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % agents.length);
  };

  const prevAgent = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + agents.length) % agents.length);
  };

  const handleThumbnailClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : (index < activeIndex ? -1 : 0));
    setActiveIndex(index);
  };


  return (
    <div className="relative">
      {/* Main featured agent */}
       <div className="relative overflow-hidden rounded-xl bg-card/70 backdrop-blur-lg p-6 mb-8 min-h-[400px] border border-border/50 shadow-xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={agents[activeIndex].slug} 
            custom={direction}
            variants={frameVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div className="space-y-4 text-center md:text-left">
              <motion.div variants={contentVariants} custom={0.1}>
                <h3 className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${agents[activeIndex].color}`}>
                  {agents[activeIndex].name}
                </h3>
              </motion.div>
              <motion.p variants={contentVariants} custom={0.2} className="text-muted-foreground">
                {agents[activeIndex].description}
              </motion.p>
              <motion.div variants={contentVariants} custom={0.3}>
                <Button
                  className={`cta-button bg-gradient-to-r ${agents[activeIndex].color}`}
                  asChild
                  suppressHydrationWarning
                >
                  <Link href={`/agents/${agents[activeIndex].slug}`}>
                    Try {agents[activeIndex].name} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
            <div className="flex justify-center">
              <motion.div
                variants={imageVariants}
                className="relative w-full max-w-[300px] aspect-square"
              >
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${agents[activeIndex].color} opacity-30 blur-2xl -z-10 animate-pulse`}
                  style={{ animationDuration: '4s' }}
                ></div>
                 <Image
                  src={`https://placehold.co/300x300.png?text=${encodeURIComponent(agents[activeIndex].name)}`}
                  alt={`${agents[activeIndex].name} visualization`}
                  width={300}
                  height={300}
                  className="object-contain rounded-xl shadow-lg"
                  data-ai-hint={agents[activeIndex].hint}
                  key={`${agents[activeIndex].slug}-image`} 
                 />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevAgent}
            className="rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 text-foreground hover:text-primary transition-colors"
            aria-label="Previous agent"
            suppressHydrationWarning
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={nextAgent}
            className="rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 text-foreground hover:text-primary transition-colors"
            aria-label="Next agent"
            suppressHydrationWarning
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Agent thumbnails carousel */}
      <div
        className="flex justify-center gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent px-4"
        ref={containerRef}
      >
        {agents.map((agent, index) => (
          <motion.div
            key={agent.slug} 
            variants={smallCardVariants}
            initial="inactive"
            animate={index === activeIndex ? 'active' : 'inactive'}
            whileHover="hover"
            whileTap="tap"
            className="cursor-pointer snap-center flex-shrink-0"
          >
            <Link href={`/agents/${agent.slug}`} passHref legacyBehavior={false} aria-label={`Demo ${agent.name}`}>
              <Card
                className={`w-24 h-28 md:w-32 md:h-36 flex flex-col items-center justify-center p-2 transition-all duration-300 modern-card ${index === activeIndex ? "border-primary shadow-primary/20" : "border-border hover:border-primary/50"}`}
              >
                <div className="relative w-12 h-12 md:w-16 md:h-16 mb-2">
                  <Image
                    src={`https://placehold.co/64x64.png?text=${encodeURIComponent(agent.name.split(" ")[0])}`}
                    alt={agent.name}
                    width={64}
                    height={64}
                    className="object-contain rounded-md"
                    data-ai-hint={agent.hint}
                    key={`${agent.slug}-thumb-image`} 
                  />
                </div>
                <p className="text-xs md:text-sm font-medium truncate w-full text-center text-foreground group-hover:text-primary transition-colors">
                  {agent.name}
                </p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AgentSection;
