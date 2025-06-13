
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ListChecks, ArrowLeft, Loader2, CheckCircle, Mic, RefreshCw, CalendarPlus, Sparkles } from 'lucide-react';
import type { DemoTaskMasterInput, DemoTaskMasterOutput } from '@/ai/flows/demo-taskmaster-flow';
import { handleTaskMasterDemoAction } from './actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const sampleTasks = "Book flights to Bali for Dec 15-30, find hotel near Seminyak, draft marketing email for new product launch, schedule team meeting for next Monday, buy groceries (milk, eggs, bread), prepare presentation slides for Q1 review";

export default function TaskMasterDemoPage() {
  const [tasksInput, setTasksInput] = useState('');
  const [priority, setPriority] = useState('Medium'); // Example, not used by current flow

  const [result, setResult] = useState<DemoTaskMasterOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const useSampleData = () => {
    setTasksInput(sampleTasks);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!tasksInput) {
        setError("Please provide some tasks for the AI to organize.");
        return;
    }

    startTransition(async () => {
      // Current flow only takes taskDescription string
      const response = await handleTaskMasterDemoAction({ taskDescription: tasksInput });
      if ('error' in response) {
        setError(response.error);
      } else {
        setResult(response);
      }
    });
  };
  
  const handleTryAgain = () => {
    setTasksInput('');
    setResult(null);
    setError(null);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-teal-900/10 to-background py-8 px-4 md:px-6 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 self-start md:self-center">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </header>

      <Card className="w-full max-w-4xl modern-card shadow-2xl border-teal-500/30 bg-card">
        <CardHeader className="text-center border-b border-teal-500/20 pb-6">
          <div className="flex justify-center items-center mb-4">
            <ListChecks className="h-16 w-16 text-teal-500" />
          </div>
          <CardTitle className="text-4xl font-bold text-teal-400">TaskMaster AI</CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-2">
            Smart task assistant – organize, assign & summarize.
          </CardDescription>
           <p className="text-sm text-muted-foreground mt-3 max-w-2xl mx-auto">
            Organizes your to-do lists, sets smart reminders, and helps you manage daily personal and professional tasks with ease.
          </p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Interactive Demo Panel */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground mb-4 text-center md:text-left">Interactive Demo Panel</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="tasksInput" className="text-foreground/90">Paste a list of messy tasks</Label>
                  <Textarea
                    id="tasksInput"
                    value={tasksInput}
                    onChange={(e) => setTasksInput(e.target.value)}
                    placeholder="e.g., buy groceries, email client, finish report by Friday"
                    className="min-h-[150px] bg-input border-border focus:ring-teal-500"
                    required
                    disabled={isPending}
                  />
                </div>
                 <div className="flex items-center space-x-3">
                    <Button type="button" variant="outline" className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300" disabled={isPending}>
                        <Mic className="mr-2 h-4 w-4" /> Input via Voice (Simulated)
                    </Button>
                     <Input type="text" placeholder="Assign priorities (e.g., High, Low)" className="bg-input border-border focus:ring-teal-500" disabled={isPending} />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={useSampleData} className="w-full sm:w-auto border-teal-500/50 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300" disabled={isPending}>
                        Use Sample Data
                    </Button>
                    <Button type="submit" className="w-full sm:flex-1 cta-button bg-teal-500 hover:bg-teal-600" disabled={isPending}>
                        {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Organizing Tasks...
                        </>
                        ) : (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" /> Organize Tasks
                        </>
                        )}
                    </Button>
                </div>
              </form>
            </div>

            {/* Output Preview */}
            <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground mb-4 text-center md:text-left">Output Preview</h3>
                {isPending && (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-12 w-12 text-teal-500 animate-spin" />
                    </div>
                )}
                {error && !isPending && (
                    <Card className="bg-destructive/10 border-destructive text-destructive p-4">
                        <CardHeader className="p-0 mb-2"><CardTitle className="text-lg">Error</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <p>{error}</p>
                            <Button variant="outline" onClick={handleTryAgain} className="mt-4 w-full"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
                        </CardContent>
                    </Card>
                )}
                {result && !isPending && (
                    <Card className="bg-primary/5 border-primary/20 p-6 shadow-lg">
                         <div className="flex items-center mb-3">
                           <ListChecks className="h-6 w-6 text-teal-400 mr-2"/>
                           <CardTitle className="text-xl text-teal-400">TaskMaster AI Organized:</CardTitle>
                        </div>
                        <pre className="whitespace-pre-wrap text-sm text-foreground bg-black/20 p-3 rounded-md mb-4">{result.simulatedResponse}</pre>
                        <p className="text-xs text-muted-foreground italic mt-2">(Simulated: Tasks neatly grouped, sorted, and summarized based on input)</p>
                         <Button variant="outline" onClick={handleTryAgain} className="mt-6 w-full border-teal-500/50 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300">
                            <RefreshCw className="mr-2 h-4 w-4" /> Organize New Tasks
                        </Button>
                    </Card>
                )}
                 {!isPending && !result && !error && (
                    <div className="text-center text-muted-foreground py-10 border border-dashed border-border rounded-lg">
                        <ListChecks size={48} className="mx-auto mb-2 opacity-30" />
                        <p>Paste your tasks and click "Organize Tasks" to see TaskMaster AI's power.</p>
                    </div>
                )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-8 border-t border-teal-500/20">
            <Button size="lg" className="cta-button bg-teal-600 hover:bg-teal-700 w-full sm:w-auto" asChild>
                <Link href="#contact"><Sparkles className="mr-2 h-5 w-5" /> Try Full 1-Day Demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-teal-500/70 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300 w-full sm:w-auto" asChild>
                <Link href="#contact"><CalendarPlus className="mr-2 h-5 w-5" /> Schedule Demo Call</Link>
            </Button>
        </CardFooter>
      </Card>
      <footer className="mt-12 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LeadSpark AI. Demo purposes only.</p>
      </footer>
    </div>
  );
}

