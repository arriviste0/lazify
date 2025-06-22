'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { InteractiveAgentInfo } from '@/types/agent';
import HorizontalAgentCard from './HorizontalAgentCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HorizontalAgentCarouselProps {
  agents: InteractiveAgentInfo[];
}

const HorizontalAgentCarousel: React.FC<HorizontalAgentCarouselProps> = ({ agents }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ playOnInit: true, delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [visibleSlides, setVisibleSlides] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const updateVisibleSlides = useCallback(() => {
    if (!emblaApi) return;
    const inView = emblaApi.slidesInView();
    setVisibleSlides(inView);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateVisibleSlides();
    emblaApi.on('select', updateVisibleSlides);
    emblaApi.on('reInit', updateVisibleSlides);
    emblaApi.on('resize', updateVisibleSlides); // Important for responsiveness
  }, [emblaApi, updateVisibleSlides]);


  if (!agents || agents.length === 0) {
    return <div className="text-center py-10">No agents to display.</div>;
  }

  return (
    <div className="embla">
      <div className="embla__viewport-wrapper">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {agents.map((agent, index) => (
              <div 
                className={cn("embla__slide", visibleSlides.includes(index) && "embla__slide--visible")} 
                key={agent.id}
              >
                <div className="embla__slide__content">
                  <HorizontalAgentCard agent={agent} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {agents.length > 1 && (
        <>
          <Button
            variant="outline"
            className="embla__button embla__button--prev"
            onClick={scrollPrev}
            aria-label="Previous agent"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="embla__button embla__button--next"
            onClick={scrollNext}
            aria-label="Next agent"
          >
            <ChevronRight />
          </Button>
        </>
      )}
    </div>
  );
};

export default HorizontalAgentCarousel;
