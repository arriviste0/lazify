
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { InteractiveAgentInfo } from '@/types/agent';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge'; // Assuming Badge component exists

interface ModernAgentCardProps {
  agent: InteractiveAgentInfo;
  isActive: boolean; // To potentially apply different styles or animations to active card
}

const ModernAgentCard: React.FC<ModernAgentCardProps> = ({ agent, isActive }) => {
  // Example: Determine badge based on agent ID or a new property in InteractiveAgentInfo
  const getBadge = () => {
    if (agent.id === 'leadspark') return <Badge variant="default" className="bg-amber-500 text-white absolute top-4 right-4 shadow-md">🔥 Popular</Badge>;
    if (agent.id === 'taskmaster') return <Badge variant="secondary" className="absolute top-4 right-4 shadow-md">⚙️ Automation</Badge>;
    return null;
  };

  return (
    <motion.div
      className="h-full" // Ensure motion div takes full height for card to expand
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className={cn(
        "h-[420px] md:h-[450px] flex flex-col justify-between relative overflow-hidden text-left", // text-left
        "bg-card text-card-foreground border border-border/30 shadow-lg rounded-xl transition-all duration-300",
        isActive ? "shadow-primary/20" : "shadow-md"
        )}
      >
        {getBadge()}
        <CardHeader className="p-6 items-start"> {/* items-start for text-left */}
          <div className={cn(
            "mb-4 p-3 rounded-lg self-start inline-block border-2",
            `bg-${agent.themeColorClass.split('-')[1]}-500/10 border-${agent.themeColorClass.split('-')[1]}-500/30`
            )}
          >
            <span className="text-5xl md:text-6xl">{agent.iconEmoji}</span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">{agent.name}</CardTitle>
        </CardHeader>

        <CardContent className="p-6 pt-0 flex-grow">
          <CardDescription className="text-muted-foreground line-clamp-3">{agent.description}</CardDescription>
        </CardContent>

        <CardFooter className="p-6 pt-2">
          <Button asChild className="w-full cta-button">
            <Link href={`/interactive-agents/${agent.id}`}>
              Try Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ModernAgentCard;
```