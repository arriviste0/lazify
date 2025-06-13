
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Mail, ArrowLeft, Loader2, Inbox, Filter, Send, RefreshCw, CalendarPlus, MessageSquare, Sparkles } from 'lucide-react';
import type { DemoInboxZeroInput, DemoInboxZeroOutput } from '@/ai/flows/demo-inboxzero-flow';
import { handleInboxZeroDemoAction } from './actions';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const sampleEmail = "Subject: Project Update - Urgent Review Needed\n\nHi Team,\n\nPlease review the attached Q3 financial report by EOD. There are a few discrepancies I'd like to discuss in tomorrow's stand-up.\n\nAlso, Sarah, can you send over the client feedback from the Alpha project?\n\nBest,\nAlex";

export default function InboxZeroDemoPage() {
  const [emailContent, setEmailContent] = useState('');
  const [autoReply, setAutoReply] = useState(true);
  const [prioritizeClients, setPrioritizeClients] = useState(true);
  const [deletePromotions, setDeletePromotions] = useState(true);

  const [result, setResult] = useState<DemoInboxZeroOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const useSampleData = () => {
    setEmailContent(sampleEmail);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!emailContent) {
        setError("Please provide some email content for the AI to process.");
        return;
    }
    
    // Combine settings with email content for a richer prompt, if desired by the flow
    // For now, the flow demoInboxZero only takes emailContent.
    const demoInput = `Email Content: ${emailContent}. Settings: Auto-reply=${autoReply}, Prioritize Clients=${prioritizeClients}, Delete Promotions=${deletePromotions}`;


    startTransition(async () => {
      // The actual Genkit flow for InboxZero currently only takes 'emailContent'.
      // The settings are for UI demonstration purposes.
      const response = await handleInboxZeroDemoAction({ emailContent: emailContent });
      if ('error' in response) {
        setError(response.error);
      } else {
        setResult(response);
      }
    });
  };

  const handleTryAgain = () => {
    setEmailContent('');
    setResult(null);
    setError(null);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-900/10 to-background py-8 px-4 md:px-6 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 self-start md:self-center">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </header>

      <Card className="w-full max-w-4xl modern-card shadow-2xl border-blue-500/30 bg-card">
        <CardHeader className="text-center border-b border-blue-500/20 pb-6">
          <div className="flex justify-center items-center mb-4">
            <Inbox className="h-16 w-16 text-blue-500" />
          </div>
          <CardTitle className="text-4xl font-bold text-blue-400">InboxZero AI</CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-2">
            Clear your inbox. Focus on what matters.
          </CardDescription>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl mx-auto">
            Filters emails, flags urgent ones, and auto-replies to routine messages. See how InboxZero AI declutters your inbox in minutes.
          </p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Interactive Demo Panel */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground mb-4 text-center md:text-left">Interactive Demo Panel</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="emailUpload" className="text-foreground/90">Upload Email Inbox (Paste Sample Email)</Label>
                  <Textarea
                    id="emailUpload"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder="Paste one or more sample emails here..."
                    className="min-h-[150px] bg-input border-border focus:ring-blue-500"
                    required
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label className="text-foreground/90">Choose Settings (Simulated)</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="autoReply" checked={autoReply} onCheckedChange={(checked) => setAutoReply(!!checked)} className="data-[state=checked]:bg-blue-500 border-blue-500/70" />
                      <Label htmlFor="autoReply" className="text-sm text-muted-foreground">Auto-reply to follow-ups</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="prioritizeClients" checked={prioritizeClients} onCheckedChange={(checked) => setPrioritizeClients(!!checked)} className="data-[state=checked]:bg-blue-500 border-blue-500/70" />
                      <Label htmlFor="prioritizeClients" className="text-sm text-muted-foreground">Prioritize client mails</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="deletePromotions" checked={deletePromotions} onCheckedChange={(checked) => setDeletePromotions(!!checked)} className="data-[state=checked]:bg-blue-500 border-blue-500/70" />
                      <Label htmlFor="deletePromotions" className="text-sm text-muted-foreground">Delete promotions</Label>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={useSampleData} className="w-full sm:w-auto border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300" disabled={isPending}>
                        Use Sample Data
                    </Button>
                    <Button type="submit" className="w-full sm:flex-1 cta-button bg-blue-500 hover:bg-blue-600" disabled={isPending}>
                        {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Inbox...
                        </>
                        ) : (
                        <>
                            <Filter className="mr-2 h-4 w-4" /> Run Demo
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
                        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
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
                           <Mail className="h-6 w-6 text-blue-400 mr-2"/>
                           <CardTitle className="text-xl text-blue-400">InboxZero AI Processed:</CardTitle>
                        </div>
                        <pre className="whitespace-pre-wrap text-sm text-foreground bg-black/20 p-3 rounded-md mb-4">{result.simulatedResponse}</pre>
                        <div className="text-sm space-y-1 text-muted-foreground">
                            {deletePromotions && <p>✅ 43 promotional emails deleted (Simulated)</p>}
                            {prioritizeClients && <p>📌 12 important emails pinned (Simulated)</p>}
                            {autoReply && <p>✉️ 9 auto-replies sent (Simulated)</p>}
                        </div>
                         <Button variant="outline" onClick={handleTryAgain} className="mt-6 w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">
                            <RefreshCw className="mr-2 h-4 w-4" /> Process Another Batch
                        </Button>
                    </Card>
                )}
                {!isPending && !result && !error && (
                    <div className="text-center text-muted-foreground py-10 border border-dashed border-border rounded-lg">
                        <Inbox size={48} className="mx-auto mb-2 opacity-30" />
                        <p>Paste email content and click "Run Demo" to see InboxZero AI in action.</p>
                    </div>
                )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-8 border-t border-blue-500/20">
            <Button size="lg" className="cta-button bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" asChild>
                <Link href="#contact"><Sparkles className="mr-2 h-5 w-5" /> Try Full 1-Day Demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-blue-500/70 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 w-full sm:w-auto" asChild>
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
