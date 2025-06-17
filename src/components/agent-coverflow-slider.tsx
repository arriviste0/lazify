
"use client";

import React, { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence, type MotionValue } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import type { AgentInfo } from '@/types/agent';
import { Button } from "@/components/ui/button";

interface AgentCardItemProps {
  agent: AgentInfo;
  scrollXProgress: MotionValue<number>;
}

const AgentCardItem: React.FC<AgentCardItemProps> = ({ agent, scrollXProgress }) => {
  const cardWidthPx = 224; // w-56

  const rotateY = useTransform(scrollXProgress, [0, 0.5, 1], [45, 0, -45]);
  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const opacity = useTransform(scrollXProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const x = useTransform(scrollXProgress, [0, 0.5, 1], [-cardWidthPx * 0.1, 0, cardWidthPx * 0.1]);
  const y = useTransform(scrollXProgress, [0, 0.5, 1], [15, 0, 15]);

  const cardBgColor = `bg-${agent.themeColor}`;
  const IconComponent = agent.lucideIcon;

  return (
    <motion.div
      style={{
        rotateY,
        scale,
        opacity,
        x,
        y,
        transformStyle: 'preserve-3d',
      }}
      className={`w-56 h-72 rounded-xl shadow-xl flex flex-col items-center justify-center ${cardBgColor} relative overflow-hidden modern-card p-0`}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Link href={`/agents/${agent.slug}`} className="w-full h-full flex flex-col items-center justify-center p-4" legacyBehavior={false}>
        {IconComponent ? (
          <IconComponent className="h-20 w-20 text-white opacity-90 mb-3" strokeWidth={1.5} />
        ) : (
          <span className="text-6xl mb-3 opacity-90">{typeof agent.icon === 'string' ? agent.icon : ''}</span>
        )}
         <span className="text-center text-sm font-medium text-white opacity-80 mt-auto line-clamp-2">
           {agent.name}
         </span>
      </Link>
    </motion.div>
  );
};


const AgentCoverflowSlider: React.FC<{ agents: AgentInfo[] }> = ({ agents }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const cardWidthPx = 224;
  const gapPx = 16;

  const totalTrackWidth = useMemo(() => {
    return agents.length * cardWidthPx + (agents.length - 1) * gapPx;
  }, [agents.length, cardWidthPx, gapPx]);

  const [currentIndex, setCurrentIndex] = useState(Math.floor(agents.length / 2));

  const { scrollXProgress } = useScroll({
    container: containerRef,
  });
  
  const scrollToCard = useCallback((index: number) => {
    if (containerRef.current) {
      const targetScrollLeft = index * (cardWidthPx + gapPx) - (containerRef.current.offsetWidth / 2 - cardWidthPx / 2);
      containerRef.current.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
      setCurrentIndex(index);
    }
  }, [cardWidthPx, gapPx]);


  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToCard(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(agents.length - 1, currentIndex + 1);
    scrollToCard(newIndex);
  };
  
  // Effect to initially center the slider (optional, can be complex with dynamic centering)
   useEffect(() => {
    if (containerRef.current && agents.length > 0) {
      const initialIndex = Math.floor(agents.length / 2);
      // Ensure containerRef.current.offsetWidth is available
      const containerWidth = containerRef.current.offsetWidth;
      if (containerWidth > 0) {
        const initialScrollLeft = initialIndex * (cardWidthPx + gapPx) - (containerWidth / 2 - cardWidthPx / 2);
        containerRef.current.scrollLeft = initialScrollLeft;
        setCurrentIndex(initialIndex);
      }
    }
  }, [agents.length, cardWidthPx, gapPx, scrollToCard]);


  return (
    <div className="relative w-full flex flex-col items-center" style={{ perspective: '1000px' }}>
      <div
        ref={containerRef}
        className="w-full flex overflow-x-scroll snap-x snap-mandatory py-8 px-4 hide-native-scrollbar items-center relative"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <motion.div
            ref={trackRef}
            className="flex items-center space-x-4"
            style={{
             paddingLeft: `calc(50vw - ${cardWidthPx / 2}px - ${gapPx / 2}px)`,
             paddingRight: `calc(50vw - ${cardWidthPx / 2}px - ${gapPx / 2}px)`,
            }}
            drag="x"
            dragConstraints={{
              left: -(totalTrackWidth - (containerRef.current?.offsetWidth || 0) + cardWidthPx + gapPx),
              right: 0,
            }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
        >
          {agents.map((agent, index) => {
            return (
              <div key={agent.slug} className="snap-center flex-shrink-0">
                <AgentCardItem agent={agent} scrollXProgress={scrollXProgress} />
              </div>
            );
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {agents.length > 1 && (
          <>
            <motion.div
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="rounded-full bg-background/70 backdrop-blur-sm hover:bg-primary/10 border-primary/30 text-primary hover:text-primary shadow-lg"
                aria-label="Previous Agent"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </motion.div>
            <motion.div
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="rounded-full bg-background/70 backdrop-blur-sm hover:bg-primary/10 border-primary/30 text-primary hover:text-primary shadow-lg"
                aria-label="Next Agent"
                disabled={currentIndex === agents.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentCoverflowSlider;

// Helper to hide native scrollbar (optional, can be done via globals.css too)
const styles = `
  .hide-native-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* IE 10+ */
  }
  .hide-native-scrollbar::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`;

if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

