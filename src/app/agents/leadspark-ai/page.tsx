
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Users, ArrowLeft, Loader2, Sparkles, Zap, BrainCircuit, RefreshCw, MessageSquare, CalendarPlus } from 'lucide-react';
import type { DemoLeadSparkInput, DemoLeadSparkOutput } from '@/ai/flows/demo-leadspark-flow';
import { handleLeadSparkDemoAction } from './actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const sampleLeadForm = {
  name: 'Priya Mehta',
  email: 'priya.mehta@example.com',
  company: 'SparkMob',
  message: 'Looking for AI to help automate email marketing for our growing e-commerce brand.',
};

export default function LeadSparkDemoPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');

  const [result, setResult] = useState<DemoLeadSparkOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const useSampleData = () => {
    setName(sampleLeadForm.name);
    setEmail(sampleLeadForm.email);
    setCompany(sampleLeadForm.company);
    setMessage(sampleLeadForm.message);
    setResult(null);
    setError(null);
  };

  const companyDescription = `Lead Name: ${name}, Email: ${email}, Company: ${company}, Message: ${message}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!message && !company) {
        setError("Please provide at least a message or company name for the AI to analyze.");
        return;
    }

    startTransition(async () => {
      const response = await handleLeadSparkDemoAction({ companyDescription });
      if ('error' in response) {
        setError(response.error);
      } else {
        setResult(response);
      }
    });
  };

  const handleTryAgain = () => {
    setName('');
    setEmail('');
    setCompany('');
    setMessage('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-900/10 to-background py-8 px-4 md:px-6 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 self-start md:self-center">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </header>

      <Card className="w-full max-w-4xl modern-card shadow-2xl border-green-500/30 bg-card">
        <CardHeader className="text-center border-b border-green-500/20 pb-6">
          <div className="flex justify-center items-center mb-4">
            <Zap className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-4xl font-bold text-green-400">LeadSpark AI</CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-2">
            Turn traffic into qualified leads—on autopilot.
          </CardDescription>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl mx-auto">
            From form-fill to follow-up — see how LeadSpark AI automates lead capture, qualification, and enrichment, helping you focus on closing deals.
          </p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Interactive Demo Panel */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground mb-4 text-center md:text-left">Interactive Demo Panel</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-foreground/90">Name (Optional)</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Mehta" className="bg-input border-border focus:ring-green-500" disabled={isPending} />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground/90">Email (Optional)</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="priya.mehta@example.com" className="bg-input border-border focus:ring-green-500" disabled={isPending} />
                </div>
                <div>
                  <Label htmlFor="company" className="text-foreground/90">Company (Optional)</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="SparkMob" className="bg-input border-border focus:ring-green-500" disabled={isPending} />
                </div>
                <div>
                  <Label htmlFor="message" className="text-foreground/90">Message / Query *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Looking for AI to help automate email marketing."
                    className="min-h-[100px] bg-input border-border focus:ring-green-500"
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={useSampleData} className="w-full sm:w-auto border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300" disabled={isPending}>
                        Use Sample Data
                    </Button>
                    <Button type="submit" className="w-full sm:flex-1 cta-button bg-green-500 hover:bg-green-600 text-background" disabled={isPending}>
                        {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Lead...
                        </>
                        ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" /> Run AI Lead Qualification
                        </>
                        )}
                    </Button>
                </div>
              </form>
            </div>

            {/* Output Preview */}
            <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground mb-4 text-center md:text-left">Output Result Preview</h3>
                {isPending && (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
                    </div>
                )}
                {error && !isPending && (
                    <Card className="bg-destructive/10 border-destructive text-destructive p-4">
                    <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-lg">Error</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p>{error}</p>
                         <Button variant="outline" onClick={handleTryAgain} className="mt-4 w-full">
                            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                        </Button>
                    </CardContent>
                    </Card>
                )}
                {result && !isPending && (
                    <Card className="bg-primary/5 border-primary/20 p-6 shadow-lg">
                        <div className="flex items-center mb-3">
                            <BrainCircuit className="h-6 w-6 text-green-400 mr-2"/>
                            <CardTitle className="text-xl text-green-400">LeadSpark AI Analysis</CardTitle>
                        </div>
                        <div className="space-y-3 text-sm">
                            <p><strong>Qualification:</strong> <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${result.qualification === 'HOT' ? 'bg-red-500 text-white' : result.qualification === 'WARM' ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white'}`}>{result.qualification}</span></p>
                            <p><strong>Category:</strong> {result.category}</p>
                            <div>
                                <p className="font-semibold">Suggested Email:</p>
                                <p className="text-muted-foreground italic bg-black/20 p-2 rounded">"{result.suggestedEmail}"</p>
                            </div>
                            <div>
                                <p className="font-semibold">Enrichment Data (Simulated):</p>
                                <ul className="list-disc list-inside text-muted-foreground ml-4">
                                    <li><strong>LinkedIn:</strong> {result.enrichmentData.linkedIn}</li>
                                    <li><strong>Company Size:</strong> {result.enrichmentData.companySize}</li>
                                    <li><strong>Website:</strong> {result.enrichmentData.website}</li>
                                </ul>
                            </div>
                            <p className="text-xs text-muted-foreground/80 pt-2">{result.analysisTime}</p>
                        </div>
                         <Button variant="outline" onClick={handleTryAgain} className="mt-6 w-full border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300">
                            <RefreshCw className="mr-2 h-4 w-4" /> Run New Analysis
                        </Button>
                    </Card>
                )}
                 {!isPending && !result && !error && (
                    <div className="text-center text-muted-foreground py-10 border border-dashed border-border rounded-lg">
                        <Zap size={48} className="mx-auto mb-2 opacity-30" />
                        <p>Enter lead details and click "Run AI Lead Qualification" to see the magic.</p>
                    </div>
                )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-8 border-t border-green-500/20">
            <Button size="lg" className="cta-button bg-green-600 hover:bg-green-700 w-full sm:w-auto" asChild>
                <Link href="#contact"><Sparkles className="mr-2 h-5 w-5" /> Try Full 1-Day Demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-green-500/70 text-green-400 hover:bg-green-500/10 hover:text-green-300 w-full sm:w-auto" asChild>
                <Link href="#contact"><CalendarPlus className="mr-2 h-5 w-5" /> Schedule Demo Call</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-muted-foreground/30 text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground w-full sm:w-auto" asChild disabled>
                <Link href="#contact"><MessageSquare className="mr-2 h-5 w-5" /> Chat with LeadSpark Bot</Link>
            </Button>
        </CardFooter>
      </Card>
      <footer className="mt-12 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LeadSpark AI. Demo purposes only.</p>
      </footer>
    </div>
  );
}
