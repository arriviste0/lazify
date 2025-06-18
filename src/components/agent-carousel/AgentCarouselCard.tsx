
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'; // Using Card for structure
import type { InteractiveAgentInfo } from '@/types/agent';
import { cn } from '@/lib/utils';

interface AgentCarouselCardProps {
  agent: InteractiveAgentInfo;
}

const AgentCarouselCard: React.FC<AgentCarouselCardProps> = ({ agent }) => {
  // Constructing theme-specific classes safely for Tailwind JIT
  // Example: if themeColorClass is "bg-blue-500", accentColor will be "blue"
  const accentColorName = agent.themeColorClass.replace('bg-', '').split('-')[0];
  const buttonAccentClass = `bg-${accentColorName}-600 hover:bg-${accentColorName}-700`;
  const iconContainerAccentClass = `bg-${accentColorName}-500/20 border-${accentColorName}-500/30`;
  const iconTextAccentClass = `text-${accentColorName}-400`;


  return (
    <motion.div
      className="w-80 md:w-96 flex-shrink-0" // Fixed width for cards
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <Card className="h-[450px] rounded-xl overflow-hidden shadow-2xl group relative bg-card/60 backdrop-blur-md border border-border/30 flex flex-col">
        {agent.slideImageUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={agent.slideImageUrl}
              alt={`${agent.name} background`}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              data-ai-hint={agent.slideImageHint || 'abstract background'}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority // Prioritize loading for potentially visible cards
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10"></div>
          </div>
        )}

        <div className="relative z-20 p-6 flex flex-col flex-grow text-white">
          <div className={cn(
            "mb-4 p-3 rounded-full self-start inline-block border-2",
            iconContainerAccentClass
            )}>
            <span className={cn("text-4xl", iconTextAccentClass)} role="img" aria-label={`${agent.name} icon`}>
              {agent.iconEmoji}
            </span>
          </div>

          <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{agent.name}</h3>
          <p className="text-sm text-neutral-200 mb-6 line-clamp-3 drop-shadow-md flex-grow">
            {agent.description}
          </p>

          <Button
            asChild
            className={cn("mt-auto w-full text-white font-semibold group-hover:shadow-lg transition-all duration-300", buttonAccentClass)}
          >
            <Link href={`/interactive-agents/${agent.id}`}>
              Try Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default AgentCarouselCard;
