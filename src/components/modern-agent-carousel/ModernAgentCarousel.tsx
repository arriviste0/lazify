
'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModernAgentCard from './ModernAgentCard';
import type { InteractiveAgentInfo } from '@/types/agent';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ModernAgentCarouselProps {
  agents: InteractiveAgentInfo[];
}

const ModernAgentCarousel: React.FC<ModernAgentCarouselProps> = ({ agents }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const itemsPerPage = isMobile ? 1 : 2; // Show 1 card on mobile, 2 on desktop
  const totalPages = Math.ceil(agents.length / itemsPerPage);

  const cardWidthPercentage = 100 / itemsPerPage; // For itemsPerPage > 1, how much % of container it takes
  const gapRem = 1; // Corresponds to gap-4 (1rem)

  const scrollToCard = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.offsetWidth;
        let scrollAmount = 0;

        if (itemsPerPage === 1) {
          // Calculate width of one card including gap (approx for centering)
          // Each card takes almost full width, minus some padding/margin
          const cardEffectiveWidth = containerWidth * 0.9; // Assuming card is 90% of container for single view
          scrollAmount = index * cardEffectiveWidth;
        } else {
          // For multiple items, scroll by pages
          const scrollLeftForIndex = (containerWidth + gapRem * 16) * index; // 16 is approx px for 1rem
          scrollAmount = scrollLeftForIndex / itemsPerPage;
        }
        
        // A more robust way for multiple items: scroll to the DOM element
        const cardElement = carouselRef.current.children[index * itemsPerPage] as HTMLElement;
        if (cardElement) {
            carouselRef.current.scrollTo({
                left: cardElement.offsetLeft - (gapRem * 16 / itemsPerPage), // Adjust for gap
                behavior: behavior,
            });
        }
      }
      setCurrentIndex(index);
    },
    [itemsPerPage, gapRem]
  );

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % totalPages;
      scrollToCard(newIndex);
      return newIndex;
    });
  }, [totalPages, scrollToCard]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + totalPages) % totalPages;
      scrollToCard(newIndex);
      return newIndex;
    });
  }, [totalPages, scrollToCard]);


  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 4000);
  }, [handleNext]);

  const stopAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isHovering) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
    return () => stopAutoScroll();
  }, [isHovering, startAutoScroll]);

  useEffect(() => {
    // Initial scroll to the first card/page without smooth behavior
     setTimeout(() => scrollToCard(0, 'auto'), 0);
  }, [itemsPerPage, scrollToCard]);


  // Handle scroll snap with IntersectionObserver to update currentIndex
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const visibleIndex = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            // For paged view
            const newPageIndex = Math.floor(visibleIndex / itemsPerPage);
            if(currentIndex !== newPageIndex) setCurrentIndex(newPageIndex);
          }
        });
      },
      {
        root: carouselRef.current,
        threshold: 0.5, // 50% of the card visible
      }
    );

    const cards = carouselRef.current?.children;
    if (cards) {
      Array.from(cards).forEach(card => observer.observe(card));
    }

    return () => {
      if (cards) {
        Array.from(cards).forEach(card => observer.unobserve(card));
      }
    };
  }, [itemsPerPage, currentIndex]);


  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)} // Pause on touch
      onTouchEnd={() => setIsHovering(false)} // Resume after touch
    >
      <div
        ref={carouselRef}
        className={cn(
            "flex overflow-x-auto snap-x snap-mandatory scroll-smooth py-4 no-scrollbar",
            isMobile ? "gap-x-4 px-[5vw]" : "gap-x-6 px-[2.5vw]" // gap-4 on mobile, gap-6 on desktop. Some padding for peeking.
        )}
      >
        {agents.map((agent, index) => (
          <div
            key={agent.id}
            data-index={index}
            className={cn(
              "flex-shrink-0 snap-center",
              isMobile ? "w-[90vw]" : `w-[calc(${cardWidthPercentage}%-${gapRem/itemsPerPage*0.85}rem)]` // Card width with gap adjustment
            )}
          >
            <ModernAgentCard agent={agent} isActive={Math.floor(index/itemsPerPage) === currentIndex} />
          </div>
        ))}
      </div>

      {agents.length > itemsPerPage && (
        <>
          <AnimatePresence>
          {currentIndex > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="rounded-full bg-background/70 backdrop-blur-sm hover:bg-primary/10 border-primary/30 text-primary hover:text-primary shadow-lg"
                aria-label="Previous agents"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
          </AnimatePresence>
          <AnimatePresence>
          {currentIndex < totalPages - 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="rounded-full bg-background/70 backdrop-blur-sm hover:bg-primary/10 border-primary/30 text-primary hover:text-primary shadow-lg"
                aria-label="Next agents"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
          </AnimatePresence>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => scrollToCard(pageIndex)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all duration-300 ease-in-out",
                currentIndex === pageIndex ? "bg-primary scale-125" : "bg-muted hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to page ${pageIndex + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernAgentCarousel;
```