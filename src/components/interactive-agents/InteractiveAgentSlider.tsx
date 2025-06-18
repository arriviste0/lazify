
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
}

const CARD_WIDTH = 288; // 72 * 4 (w-72 in tailwind)
const CARD_GAP = 8; // Reduced from 16

const InteractiveAgentSlider: React.FC<InteractiveAgentSliderProps> = ({ agents }) => {
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

  // Update padding to correctly center the card when using CARD_GAP for spacing
  const PADDING_HORIZONTAL = `calc(50% - ${CARD_WIDTH / 2}px - ${CARD_GAP / 2}px)`;


  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory py-4 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent scrollbar-thumb-rounded-full"
        style={{
          paddingLeft: PADDING_HORIZONTAL,
          paddingRight: PADDING_HORIZONTAL,
        }}
      >
        <AnimatePresence initial={false}>
          {/* Use a flex container for the cards with a defined gap */}
          <motion.div className="flex" style={{ gap: `${CARD_GAP}px` }}>
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                className="snap-center flex-shrink-0" // Removed mx-1, gap is handled by parent
                style={{ width: `${CARD_WIDTH}px` }}
                initial={{ opacity: 0.7, scale: 0.9 }}
                animate={{ 
                  opacity: index === currentIndex ? 1 : 0.7,
                  scale: index === currentIndex ? 1 : 0.9,
                  x: (index - currentIndex) * (CARD_WIDTH + CARD_GAP) / 4 // Adjusted parallax for tighter spacing
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <AgentCard agent={agent} />
              </motion.div>
            ))}
          </motion.div>
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
