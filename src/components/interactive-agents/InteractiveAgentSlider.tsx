
"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { InteractiveAgentInfo } from "@/types/agent";
import AgentCard from "./AgentCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InteractiveAgentSliderProps {
  agents: InteractiveAgentInfo[];
  onTryDemo: (agent: InteractiveAgentInfo) => void;
}

const CARD_WIDTH = 288; // 72 * 4 (w-72 in tailwind)
const CARD_GAP = 16; // space-x-4

const InteractiveAgentSlider: React.FC<InteractiveAgentSliderProps> = ({ agents, onTryDemo }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (direction: "prev" | "next") => {
    if (!containerRef.current) return;

    const newIndex = direction === "prev"
      ? Math.max(0, currentIndex - 1)
      : Math.min(agents.length - 1, currentIndex + 1);

    const scrollAmount = newIndex * (CARD_WIDTH + CARD_GAP);
    containerRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    setCurrentIndex(newIndex);
  };

  // Auto-scroll attempt (can be tricky with manual drag)
  // useEffect(() => {
  //   if (agents.length <= 1) return;
  //   const interval = setInterval(() => {
  //     handleScroll("next");
  //     if (currentIndex === agents.length - 1) {
  //        // This logic needs refinement to loop back smoothly or stop
  //       if (containerRef.current) containerRef.current.scrollTo({ left: 0, behavior: 'smooth'});
  //       setCurrentIndex(0);
  //     }
  //   }, 5000); // Auto-scroll every 5 seconds
  //   return () => clearInterval(interval);
  // }, [currentIndex, agents.length]);


  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory py-4 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent scrollbar-thumb-rounded-full"
        style={{
          paddingLeft: `calc(50% - ${CARD_WIDTH / 2}px)`,
          paddingRight: `calc(50% - ${CARD_WIDTH / 2}px)`,
        }}
      >
        <AnimatePresence initial={false}>
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              className="snap-center flex-shrink-0 mx-2" // mx-2 provides the gap
              style={{ width: `${CARD_WIDTH}px` }}
              initial={{ opacity: 0.7, scale: 0.9 }}
              animate={{ 
                opacity: index === currentIndex ? 1 : 0.7,
                scale: index === currentIndex ? 1 : 0.9,
                x: (index - currentIndex) * (CARD_WIDTH + CARD_GAP) / 3 // Subtle parallax
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <AgentCard agent={agent} onTryDemo={() => onTryDemo(agent)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {agents.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleScroll("prev")}
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/70 hover:bg-primary/10 border-primary/30 text-primary hover:text-primary shadow-lg disabled:opacity-30"
            disabled={currentIndex === 0}
            aria-label="Previous Agent"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleScroll("next")}
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/70 hover:bg-primary/10 border-primary/30 text-primary hover:text-primary shadow-lg disabled:opacity-30"
            disabled={currentIndex === agents.length - 1}
            aria-label="Next Agent"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
      <div className="flex justify-center space-x-2 mt-6">
          {agents.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (containerRef.current) {
                    containerRef.current.scrollTo({ left: idx * (CARD_WIDTH + CARD_GAP), behavior: 'smooth' });
                    setCurrentIndex(idx);
                }
              }}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all duration-300",
                currentIndex === idx ? "bg-primary scale-125" : "bg-muted hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to agent ${idx + 1}`}
            />
          ))}
        </div>
    </div>
  );
};

export default InteractiveAgentSlider;
