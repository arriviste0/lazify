
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
      className="bg-amber-50 text-neutral-800 shadow-xl rounded-xl p-6 flex flex-col items-center text-center h-[380px] border border-amber-200"
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)"}}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-5xl mb-4">{agent.iconEmoji}</div>
      <h3 className="text-xl font-semibold mb-2 text-neutral-900">{agent.name}</h3>
      <p className="text-sm text-neutral-600 mb-6 flex-grow line-clamp-3">{agent.description}</p>
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
