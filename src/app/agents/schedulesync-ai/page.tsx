
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CalendarDays, ArrowLeft, Loader2, CalendarCheck2, Users, Clock, RefreshCw, CalendarPlus, Sparkles } from 'lucide-react';
import type { DemoScheduleSyncInput, DemoScheduleSyncOutput } from '@/ai/flows/demo-schedulesync-flow';
import { handleScheduleSyncDemoAction } from './actions';
import { Label } from '@/components/ui/label';

const sampleMeetingRequest = "Schedule a 30-minute project review meeting with John and Priya for next Tuesday afternoon. My availability is flexible after 2 PM. Find a slot that works for all. Topic: Q4 Strategy Discussion.";

export default function ScheduleSyncDemoPage() {
  const [meetingRequest, setMeetingRequest] = useState('');
  const [result, setResult] = useState<DemoScheduleSyncOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const useSampleData = () => {
    setMeetingRequest(sampleMeetingRequest);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!meetingRequest) {
        setError("Please provide some meeting details for the AI to process.");
        return;
    }

    startTransition(async () => {
      const response = await handleScheduleSyncDemoAction({ meetingDetails: meetingRequest });
      if ('error' in response) {
        setError(response.error);
      } else {
        setResult(response);
      }
    });
  };

  const handleTryAgain = () => {
    setMeetingRequest('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-amber-900/10 to-background py-8 px-4 md:px-6 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 self-start md:self-center">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </header>

      <Card className="w-full max-w-4xl modern-card shadow-2xl border-amber-500/30 bg-card">
        <CardHeader className="text-center border-b border-amber-500/20 pb-6">
          <div className="flex justify-center items-center mb-4">
            <CalendarDays className="h-16 w-16 text-amber-500" />
          </div>
          <CardTitle className="text-4xl font-bold text-amber-400">ScheduleSync AI</CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-2">
            Auto-manage meetings, reminders & conflicts.
          </CardDescription>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl mx-auto">
            Effortlessly coordinate meetings, find optimal times, resolve conflicts, and manage your calendar invites across platforms.
          </p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Interactive Demo Panel */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground mb-4 text-center md:text-left">Interactive Demo Panel</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="meetingRequest" className="text-foreground/90">Enter Meeting Request</Label>
                  <Textarea
                    id="meetingRequest"
                    value={meetingRequest}
                    onChange={(e) => setMeetingRequest(e.target.value)}
                    placeholder="e.g., 'Book a 1-hour call with Marketing team next week to discuss campaign launch.'"
                    className="min-h-[150px] bg-input border-border focus:ring-amber-500"
                    required
                    disabled={isPending}
                  />
                </div>
                 <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CalendarCheck2 className="h-5 w-5 text-amber-400" />
                    <span>Connect to Google Calendar (Simulated)</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={useSampleData} className="w-full sm:w-auto border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300" disabled={isPending}>
                        Use Sample Data
                    </Button>
                    <Button type="submit" className="w-full sm:flex-1 cta-button bg-amber-500 hover:bg-amber-600 text-background" disabled={isPending}>
                        {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Syncing Calendar...
                        </>
                        ) : (
                        <>
                            <CalendarCheck2 className="mr-2 h-4 w-4" /> Sync Now
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
                        <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
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
                           <CalendarDays className="h-6 w-6 text-amber-400 mr-2"/>
                           <CardTitle className="text-xl text-amber-400">ScheduleSync AI Confirmed:</CardTitle>
                        </div>
                        <pre className="whitespace-pre-wrap text-sm text-foreground bg-black/20 p-3 rounded-md mb-4">{result.simulatedResponse}</pre>
                        <div className="text-sm space-y-2 text-muted-foreground">
                            <p className="flex items-center"><Users className="h-4 w-4 mr-2 text-amber-300" /> Attendees invited (Simulated)</p>
                            <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-amber-300" /> Conflict checks complete (Simulated)</p>
                            <p className="flex items-center"><CalendarCheck2 className="h-4 w-4 mr-2 text-amber-300" /> Smart reschedule suggestions applied (Simulated)</p>
                        </div>
                         <Button variant="outline" onClick={handleTryAgain} className="mt-6 w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300">
                            <RefreshCw className="mr-2 h-4 w-4" /> Schedule Another Meeting
                        </Button>
                    </Card>
                )}
                 {!isPending && !result && !error && (
                    <div className="text-center text-muted-foreground py-10 border border-dashed border-border rounded-lg">
                        <CalendarDays size={48} className="mx-auto mb-2 opacity-30" />
                        <p>Enter meeting details and click "Sync Now" to see ScheduleSync AI at work.</p>
                    </div>
                )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-8 border-t border-amber-500/20">
            <Button size="lg" className="cta-button bg-amber-600 hover:bg-amber-700 w-full sm:w-auto" asChild>
                <Link href="#contact"><Sparkles className="mr-2 h-5 w-5" /> Try Full 1-Day Demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-amber-500/70 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 w-full sm:w-auto" asChild>
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

