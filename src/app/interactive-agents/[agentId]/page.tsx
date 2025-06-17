
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Import agent data (assuming it's exported from the main page or a shared lib)
import { interactiveAgentsData } from '@/app/page'; 
import type { InteractiveAgentInfo } from '@/types/agent';

// Demo Component Imports
import InboxZeroDemo from "@/components/interactive-agents/demos/InboxZeroDemo";
import LeadSparkDemo from "@/components/interactive-agents/demos/LeadSparkDemo";
import ContentCraftDemo from "@/components/interactive-agents/demos/ContentCraftDemo";
import ScheduleSyncDemo from "@/components/interactive-agents/demos/ScheduleSyncDemo";
import TaskMasterDemo from "@/components/interactive-agents/demos/TaskMasterDemo";
import FinanceTrackerDemo from "@/components/interactive-agents/demos/FinanceTrackerDemo";
import ShopSmartDemo from "@/components/interactive-agents/demos/ShopSmartDemo";


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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-amber-950/10 to-background py-8 px-4 md:px-6 flex flex-col items-center">
      <header className="w-full max-w-3xl mb-8">
        <Button variant="ghost" onClick={() => router.push('/')} className="text-primary hover:text-primary/80 hover:bg-primary/5">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </header>

      <main className="w-full max-w-3xl">
        <Card className="bg-amber-50/80 backdrop-blur-lg text-neutral-800 border border-amber-200/50 shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="text-center pb-6 border-b border-amber-300/50 bg-amber-100/50 p-6">
            <div className="text-5xl mb-4 mx-auto w-fit">{agent.iconEmoji}</div>
            <CardTitle className="text-3xl font-bold text-neutral-900">{agent.name}</CardTitle>
            {agent.longDescription && (
              <CardDescription className="text-md text-neutral-600 pt-2 max-w-xl mx-auto">
                {agent.longDescription}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            {renderDemoContent()}
          </CardContent>

          <CardFooter className="p-6 border-t border-amber-300/50 bg-amber-100/30 sm:justify-center gap-4 flex-col sm:flex-row">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary w-full sm:w-auto" asChild>
              <Link href="/#contact">Request Custom Agent</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto" asChild>
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

    