
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { interactiveAgentsData } from '@/app/page';
import type { InteractiveAgentInfo } from '@/types/agent';

import InboxZeroDemo from "@/components/interactive-agents/demos/InboxZeroDemo";
import LeadSparkDemo from "@/components/interactive-agents/demos/LeadSparkDemo";
import ContentCraftDemo from "@/components/interactive-agents/demos/ContentCraftDemo";
import ScheduleSyncDemo from "@/components/interactive-agents/demos/ScheduleSyncDemo";
import TaskMasterDemo from "@/components/interactive-agents/demos/TaskMasterDemo";
import FinanceTrackerDemo from "@/components/interactive-agents/demos/FinanceTrackerDemo";
import ShopSmartDemo from "@/components/interactive-agents/demos/ShopSmartDemo";
import { cn } from '@/lib/utils';

export default function AgentDemoPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;

  const agent = interactiveAgentsData.find((a) => a.id === agentId);

  if (!agent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
        <p className="mb-6 text-muted-foreground">The requested agent demo could not be found.</p>
        <Button onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </div>
    );
  }

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
        return <p className="text-center text-muted-foreground">No demo UI available for this agent yet.</p>;
    }
  };

  // Extract color name for dynamic class generation, e.g., "blue" from "bg-blue-500"
  const colorName = agent.themeColorClass.replace('bg-', '').split('-')[0];
  const agentThemeGradientFrom = `from-background`;
  const agentThemeGradientVia = `via-${colorName}-950/10`; // e.g. via-blue-950/10
  const agentThemeGradientTo = `to-background`;
  const agentCardBorderColor = `border-${colorName}-500/30`; // e.g. border-blue-500/30
  const agentIconColor = `text-${colorName}-400`; // e.g. text-blue-400
  const agentTitleColor = `text-${colorName}-500`; // e.g. text-blue-500, might need adjustment for light/dark themes

  return (
    <div className={cn(
        "min-h-screen py-8 px-4 md:px-6 flex flex-col items-center bg-gradient-to-br",
        agentThemeGradientFrom,
        agentThemeGradientVia,
        agentThemeGradientTo
      )}
    >
      <header className="w-full max-w-3xl mb-8">
        <Button variant="ghost" onClick={() => router.push('/')} className="text-primary hover:text-primary/80 hover:bg-primary/5">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </header>

      <main className="w-full max-w-3xl">
        <Card className={cn(
            "bg-card/80 backdrop-blur-lg text-foreground border shadow-2xl rounded-xl overflow-hidden",
            agentCardBorderColor
          )}
        >
          <CardHeader className={cn(
              "text-center pb-6 border-b p-6 md:p-8",
              `border-${colorName}-500/20 bg-${colorName}-500/5`
            )}
          >
            <div className={cn("text-6xl mb-4 mx-auto w-fit", agentIconColor)}>{agent.iconEmoji}</div>
            <CardTitle className={cn("text-3xl md:text-4xl font-bold", agentTitleColor)}>{agent.name}</CardTitle>
            {agent.longDescription && (
              <CardDescription className="text-md text-muted-foreground pt-3 max-w-xl mx-auto">
                {agent.longDescription}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            {renderDemoContent()}
          </CardContent>

          <CardFooter className={cn(
              "p-6 border-t sm:justify-center gap-4 flex-col sm:flex-row",
              `border-${colorName}-500/20 bg-${colorName}-500/5`
            )}
          >
            <Button variant="outline" className="outline-button-glow w-full sm:w-auto" asChild>
              <Link href="/#contact">Request Custom Agent</Link>
            </Button>
            <Button className="cta-button w-full sm:w-auto" asChild>
               <Link href="/#contact">Book a Free Demo Call</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>

      <footer className="mt-12 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Lazify AI. Interactive Demo.</p>
      </footer>
    </div>
  );
}
