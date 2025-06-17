
"use client";

import React, { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence, type MotionValue } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import type { AgentInfo } from '@/types/agent';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AgentCardItemProps {
  agent: AgentInfo;
  scrollXProgress: MotionValue<number>;
  index: number;
  totalCards: number;
  cardWidthPx: number;
}

const AgentCardItem: React.FC<AgentCardItemProps> = ({ agent, scrollXProgress, index, totalCards, cardWidthPx }) => {
  const cardCenter = (index + 0.5) / totalCards;
  const distanceFromCenter = useTransform(scrollXProgress, (latestX) => Math.abs(latestX - cardCenter));

  const rotateY = useTransform(scrollXProgress, (latestX) => {
    const relativeProgress = (latestX - cardCenter) * totalCards * 2.5; // Increase multiplier for more rotation
    return relativeProgress * -30; // Max rotation 30 degrees
  });

  const scale = useTransform(distanceFromCenter, [0, 0.5 / totalCards, 1 / totalCards], [1, 0.9, 0.85]);
  const opacity = useTransform(distanceFromCenter, [0, 0.5 / totalCards, 1 / totalCards], [1, 0.85, 0.7]);
  const y = useTransform(distanceFromCenter, [0, 0.5 / totalCards, 1 / totalCards], [0, 15, 25]);
  const z = useTransform(distanceFromCenter, [0, 0.5 / totalCards, 1 / totalCards], [0, -30, -60]); // Push side cards back

  const IconComponent = agent.lucideIcon;

  // Constructing theme-specific classes safely for Tailwind JIT
  const iconBoxBgClass = `bg-${agent.themeColor}`;
  const ctaButtonBgClass = `bg-${agent.themeColor}`;
  const ctaButtonHoverBgClass = `hover:opacity-90`;


  return (
    <motion.div
      style={{
        rotateY,
        scale,
        opacity,
        y,
        z,
        transformStyle: 'preserve-3d',
      }}
      className="w-72 h-[400px] rounded-xl shadow-2xl overflow-hidden relative cursor-pointer bg-card border border-card-foreground/10 group"
      whileHover={{ scale: useTransform(scale, s => s * 1.03), y: useTransform(y, currentY => currentY -5), transition: { duration: 0.2 } }}
    >
      <Link href={`/agents/${agent.slug}`} className="block w-full h-full">
        <Image
          src={`https://placehold.co/288x400.png?text=${encodeURIComponent(agent.name.split(" ")[0])}`}
          alt={agent.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={agent.coverImageHint}
          priority={index < 3}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 p-5 flex flex-col text-white">
          <div className={cn("p-2.5 rounded-lg self-start mb-3 shadow-md", iconBoxBgClass)}>
            {IconComponent ? (
              <IconComponent className="h-7 w-7 text-white" strokeWidth={2} />
            ) : (
              <span className="text-2xl text-white">{typeof agent.icon === 'string' ? agent.icon : ''}</span>
            )}
          </div>
          <h3 className="text-2xl font-bold mb-2 drop-shadow-md">{agent.name}</h3>
          <p className="text-xs text-neutral-200 mb-4 line-clamp-3 drop-shadow-sm flex-grow">
            {agent.cardDescription}
          </p>
          <div className="mt-auto">
            <div className={cn("inline-flex items-center text-sm font-semibold py-2 px-3 rounded-md transition-colors duration-200 text-white", ctaButtonBgClass, ctaButtonHoverBgClass)}>
              Explore Agent <ChevronRight className="ml-1.5 h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


const AgentCoverflowSlider: React.FC<{ agents: AgentInfo[] }> = ({ agents }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWidthPx = 288; // w-72
  const gapPx = 16; // space-x-4

  const { scrollXProgress } = useScroll({ container: containerRef });

  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToCard = useCallback((index: number) => {
    if (containerRef.current) {
      const targetScrollLeft = index * (cardWidthPx + gapPx) - (containerRef.current.offsetWidth / 2 - cardWidthPx / 2) + (gapPx / 2) ;
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

   useEffect(() => {
    if (containerRef.current && agents.length > 0) {
      const initialIndex = Math.floor(agents.length / 2);
      const containerWidth = containerRef.current.offsetWidth;
      if (containerWidth > 0) {
        const initialScrollLeft = initialIndex * (cardWidthPx + gapPx) - (containerWidth / 2 - cardWidthPx / 2) + (gapPx / 2);
        containerRef.current.scrollLeft = initialScrollLeft;
        setCurrentIndex(initialIndex);
      }
    }
  }, [agents.length, cardWidthPx, gapPx, scrollToCard]);


  return (
    <div className="relative w-full flex flex-col items-center" style={{ perspective: '1200px' }}>
      <div
        ref={containerRef}
        className="w-full flex overflow-x-scroll snap-x snap-mandatory py-8 px-4 hide-native-scrollbar items-center relative"
        style={{ WebkitOverflowScrolling: 'touch' }}
        onScroll={(e) => {
            const scrollLeft = e.currentTarget.scrollLeft;
            const containerWidth = e.currentTarget.offsetWidth;
            const newIdx = Math.round((scrollLeft + containerWidth / 2 - cardWidthPx / 2 - gapPx / 2) / (cardWidthPx + gapPx));
            if(newIdx !== currentIndex && newIdx >= 0 && newIdx < agents.length) {
                setCurrentIndex(newIdx);
            }
        }}
      >
        <motion.div
            className="flex items-center space-x-4"
            style={{
             paddingLeft: `calc(50vw - ${cardWidthPx / 2}px)`,
             paddingRight: `calc(50vw - ${cardWidthPx / 2}px)`,
            }}
        >
          {agents.map((agent, index) => (
            <div key={agent.slug} className="snap-center flex-shrink-0">
              <AgentCardItem
                agent={agent}
                scrollXProgress={scrollXProgress}
                index={index}
                totalCards={agents.length}
                cardWidthPx={cardWidthPx}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {agents.length > 1 && (
          <>
            <motion.div
              className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="rounded-full bg-background/70 backdrop-blur-sm hover:bg-primary/10 border-primary/30 text-primary hover:text-primary shadow-lg disabled:opacity-50"
                aria-label="Previous Agent"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </motion.div>
            <motion.div
              className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="rounded-full bg-background/70 backdrop-blur-sm hover:bg-primary/10 border-primary/30 text-primary hover:text-primary shadow-lg disabled:opacity-50"
                aria-label="Next Agent"
                disabled={currentIndex === agents.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {agents.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {agents.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToCard(idx)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                currentIndex === idx ? "bg-primary" : "bg-muted hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to agent ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentCoverflowSlider;

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
