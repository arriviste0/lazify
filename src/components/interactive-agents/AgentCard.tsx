
"use client";

import React from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AgentCardProps {
  agent: InteractiveAgentInfo;
  onTryDemo: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onTryDemo }) => {
  return (
    <motion.div 
      className="relative rounded-xl p-6 flex flex-col items-center text-center h-[380px] bg-card/70 backdrop-blur-md border border-border/50 shadow-xl overflow-hidden"
      whileHover={{ y: -10, scale: 1.05, boxShadow: "0 12px 24px hsla(var(--primary)/0.25)"}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="text-5xl mb-4">{agent.iconEmoji}</div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{agent.name}</h3>
      <p className="text-sm text-muted-foreground mb-6 flex-grow line-clamp-3">{agent.description}</p>
      <Button 
        onClick={onTryDemo} 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        size="lg"
      >
        Try Demo
      </Button>
    </motion.div>
  );
};

export default AgentCard;
