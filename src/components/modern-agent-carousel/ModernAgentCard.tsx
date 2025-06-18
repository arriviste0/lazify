
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InteractiveAgentInfo } from '@/types/agent';
import { cn } from '@/lib/utils';

interface ModernAgentCardProps {
  agent: InteractiveAgentInfo;
  isActive: boolean; 
}

const ModernAgentCard: React.FC<ModernAgentCardProps> = ({ agent, isActive }) => {
  
  const iconColor = agent.themeColorClass.replace('bg-', '').split('-')[0];
  const iconBgGradient = `linear-gradient(135deg, var(--${iconColor}-500, hsl(var(--primary))), var(--${iconColor}-700, hsl(var(--accent))))`;


  return (
    <motion.div 
        className="slide-content-wrapper" // Wrapper for potential future individual animations like slideInUp
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: Math.random() * 0.2 }} // Staggered entry for cards
    >
        <div className={cn(
            "slide-content", // Class from example
            isActive ? "slide-active" : ""
        )}>
            <div 
              className="slide-icon" 
              style={{ background: agent.themeColorClass ? `var(--theme-${iconColor})` : 'hsl(var(--primary))' }}
              // Fallback if themeColorClass isn't a perfect map to a CSS var, or use direct gradient
            >
                {agent.iconEmoji}
            </div>
            <h3 className="slide-title">{agent.name}</h3>
            <p className="slide-description">
                {agent.longDescription || agent.description}
            </p>
            <Button asChild className={cn("slide-cta", agent.themeColorClass ? `hover-theme-${iconColor}` : 'hover:bg-primary/80' )}>
                <Link href={`/interactive-agents/${agent.id}`}>
                Try Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
    </motion.div>
  );
};

export default ModernAgentCard;
