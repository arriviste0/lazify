
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InteractiveAgentInfo } from '@/types/agent';
import { cn } from '@/lib/utils';

interface HorizontalAgentCardProps {
  agent: InteractiveAgentInfo;
}

const HorizontalAgentCard: React.FC<HorizontalAgentCardProps> = ({ agent }) => {
  const iconColorName = agent.themeColorClass.replace('bg-', '').split('-')[0];
  // Ensure the CSS variable exists in globals.css, e.g., --theme-blue, --theme-amber
  const iconBackgroundStyle = agent.themeColorClass 
    ? { background: `var(--theme-${iconColorName}, hsl(var(--primary)))` }
    : { background: 'hsl(var(--primary))' };

  return (
    <motion.div
      className="horizontal-agent-card"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div 
        className="horizontal-agent-card__icon-wrapper"
        style={iconBackgroundStyle}
      >
        {agent.iconEmoji}
      </div>
      <h3 className="horizontal-agent-card__title">{agent.name}</h3>
      <p className="horizontal-agent-card__description">
        {agent.description}
      </p>
      <div className="horizontal-agent-card__cta">
        <Button asChild className={cn("cta-button w-full text-sm py-2.5")} size="sm">
          <Link href={`/interactive-agents/${agent.id}`}>
            Try Demo <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default HorizontalAgentCard;
