
"use client";

import React from "react";
import Link from "next/link";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Demo Component Imports (Placeholders for now)
import InboxZeroDemo from "./demos/InboxZeroDemo";
import LeadSparkDemo from "./demos/LeadSparkDemo";
import ContentCraftDemo from "./demos/ContentCraftDemo";
import ScheduleSyncDemo from "./demos/ScheduleSyncDemo";
import TaskMasterDemo from "./demos/TaskMasterDemo";
import FinanceTrackerDemo from "./demos/FinanceTrackerDemo";
import ShopSmartDemo from "./demos/ShopSmartDemo";

interface AgentDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: InteractiveAgentInfo | null;
}

const AgentDemoModal: React.FC<AgentDemoModalProps> = ({ isOpen, onClose, agent }) => {
  if (!agent) return null;

  const renderDemoContent = () => {
    switch (agent.demoType) {
      case "inboxZero":
        return <InboxZeroDemo agent={agent} />;
      case "leadSpark":
        return <LeadSparkDemo agent={agent} />;
      case "contentCraft":
        return <ContentCraftDemo agent={agent} />;
      case "scheduleSync":
        return <ScheduleSyncDemo agent={agent} />;
      case "taskMaster":
        return <TaskMasterDemo agent={agent} />;
      case "financeTracker":
        return <FinanceTrackerDemo agent={agent} />;
      case "shopSmart":
        return <ShopSmartDemo agent={agent} />;
      default:
        return <p>No demo available for this agent yet.</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-amber-50 text-neutral-800 max-h-[90vh] flex flex-col">
        <DialogHeader className="text-left pb-4 border-b border-amber-200">
          <DialogTitle className="text-2xl font-bold text-neutral-900">
            <span className="mr-3 text-3xl">{agent.iconEmoji}</span>
            {agent.name} - Demo
          </DialogTitle>
          {agent.longDescription && (
            <DialogDescription className="text-sm text-neutral-600 pt-1">
              {agent.longDescription}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="py-6 overflow-y-auto flex-grow">
          {renderDemoContent()}
        </div>

        <DialogFooter className="pt-6 border-t border-amber-200 sm:justify-start gap-3 flex-col sm:flex-row">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary" asChild>
            <Link href="#contact">Request Custom Agent</Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
             <Link href="#contact">Book a Free Demo Call</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentDemoModal;
