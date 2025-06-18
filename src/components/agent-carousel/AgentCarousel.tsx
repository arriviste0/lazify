
'use client';

import React,
 { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, PanInfo, useScroll } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AgentCarouselCard from './AgentCarouselCard';
import type { InteractiveAgentInfo } from '@/types/agent';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface AgentCarouselProps {
  agents: InteractiveAgentInfo[];
}

const CARD_WIDTH_DESKTOP = 384 + 24; // 384px (w-96) + 24px (gap-6)
const CARD_WIDTH_MOBILE = 320 + 16; // 320px (w-80) + 16px (gap-4)

const AgentCarousel: React.FC<AgentCarouselProps> = ({ agents }) => {
  const controls = useAnimation();
  const dragX = useMotionValue(0); // Motion value for drag and button-based translation
  const carouselWrapperRef = useRef<HTMLDivElement>(null); // Ref for the outermost container of the carousel
  
  const { scrollYProgress } = useScroll({
    target: carouselWrapperRef,
    offset: ["start end", "end start"] // Animate when the carousel is in view
  });

  // Parallax effect: move cards horizontally based on page scroll
  // Moves cards by -100px when carousel starts entering view, to +100px when it's fully scrolled past
  const parallaxX = useTransform(scrollYProgress, [0, 1], [-150, 150]);


  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const isMobile = useIsMobile();

  const cardWidth = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP;
  const totalWidth = cardWidth * agents.length;
  const visibleCards = typeof window !== 'undefined' ? Math.floor(containerWidth / cardWidth) : 1;
  const maxIndex = Math.max(0, agents.length - Math.max(1,visibleCards));


  useEffect(() => {
    const updateWidth = () => {
      if (carouselWrapperRef.current) {
        setContainerWidth(carouselWrapperRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [isMobile]);

  const handleNext = useCallback(() => {
    const newIndex = Math.min(currentIndex + 1, maxIndex);
    setCurrentIndex(newIndex);
  }, [currentIndex, maxIndex]);

  const handlePrev = useCallback(() => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  useEffect(() => {
    // Update dragX for button clicks (snapping)
    dragX.set(-currentIndex * cardWidth);
    controls.start({
      x: -currentIndex * cardWidth,
      transition: { type: 'spring', stiffness: 300, damping: 40 },
    });
  }, [currentIndex, cardWidth, controls, dragX]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const currentOffset = dragX.get();
    const dragThreshold = cardWidth / 4; // Reduced threshold for easier swipe
    
    if (info.offset.x < -dragThreshold) {
      handleNext();
    } else if (info.offset.x > dragThreshold) {
      handlePrev();
    } else {
      // Snap back to current card if drag is not enough
       controls.start({
        x: -currentIndex * cardWidth,
        transition: { type: 'spring', stiffness: 400, damping: 50 },
      });
    }
  };
  
  const numPages = Math.max(1, Math.ceil(agents.length / Math.max(1, visibleCards)));
  const currentPage = Math.floor(currentIndex / Math.max(1, visibleCards));


  return (
    <div className="relative w-full overflow-hidden" ref={carouselWrapperRef}> {/* Added overflow-hidden here */}
      <motion.div
        className={cn("flex py-4 cursor-grab active:cursor-grabbing", isMobile ? "gap-4 px-4" : "gap-6 px-6")}
        drag="x"
        dragConstraints={{
          left: -(totalWidth - containerWidth + (isMobile ? 16 : 24) - cardWidth * (visibleCards > 1 ? 0.5 : 0)),
          right: 0,
        }}
        style={{ 
          x: dragX, // This will be controlled by drag and buttons
          translateX: parallaxX // This adds the scroll-driven parallax
        }}
        animate={controls}
        onDragEnd={handleDragEnd}
        onWheel={(e) => {
          // Optional: Prevent vertical scroll while horiontally scrolling carousel with wheel
          // if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation();
        }}
      >
        {agents.map((agent) => (
          <AgentCarouselCard key={agent.id} agent={agent} />
        ))}
      </motion.div>

      {agents.length > visibleCards && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/70 backdrop-blur-sm hover:bg-primary/10 border-primary/30 text-primary hover:text-primary shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous agents"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/70 backdrop-blur-sm hover:bg-primary/10 border-primary/30 text-primary hover:text-primary shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next agents"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
      
      {numPages > 1 && (
         <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: numPages }).map((_, pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => setCurrentIndex(Math.min(maxIndex, pageIndex * Math.max(1, visibleCards)))}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all duration-300 ease-in-out",
                  currentPage === pageIndex ? "bg-primary scale-125" : "bg-muted hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to page ${pageIndex + 1}`}
              />
            ))}
          </div>
      )}
    </div>
  );
};

export default AgentCarousel;
