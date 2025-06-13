
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Sparkles as SparklesIcon, ArrowLeft, Loader2, Edit3, MessageCircle, Mic, RefreshCw, CalendarPlus } from 'lucide-react'; // Renamed Sparkles to SparklesIcon
import type { DemoContentCraftInput, DemoContentCraftOutput } from '@/ai/flows/demo-contentcraft-flow';
import { handleContentCraftDemoAction } from './actions';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const sampleTopic = "AI for small business productivity";

export default function ContentCraftDemoPage() {
  const [contentTopic, setContentTopic] = useState('');
  const [contentType, setContentType] = useState('Blog');
  const [tone, setTone] = useState('Friendly');
  
  const [result, setResult] = useState<DemoContentCraftOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const useSampleData = () => {
    setContentTopic(sampleTopic);
    setContentType('Blog');
    setTone('Friendly');
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!contentTopic) {
        setError("Please provide a topic for the AI to write about.");
        return;
    }
    
    const composedTopic = `Content Type: ${contentType}, Tone: ${tone}, Topic: ${contentTopic}`;

    startTransition(async () => {
      // The actual Genkit flow for ContentCraft currently only takes 'contentTopic'.
      // ContentType and Tone are for UI demonstration.
      const response = await handleContentCraftDemoAction({ contentTopic: composedTopic });
      if ('error' in response) {
        setError(response.error);
      } else {
        setResult(response);
      }
    });
  };

  const handleTryAgain = () => {
    setContentTopic('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-rose-900/10 to-background py-8 px-4 md:px-6 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 self-start md:self-center">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </header>

      <Card className="w-full max-w-4xl modern-card shadow-2xl border-rose-500/30 bg-card">
        <CardHeader className="text-center border-b border-rose-500/20 pb-6">
          <div className="flex justify-center items-center mb-4">
            <Edit3 className="h-16 w-16 text-rose-500" />
          </div>
          <CardTitle className="text-4xl font-bold text-rose-400">ContentCraft AI</CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-2">
            Create blog, social, & email content instantly.
          </CardDescription>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl mx-auto">
            Your AI partner for brainstorming, drafting, and refining engaging content for blogs, social media, and marketing materials.
          </p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Interactive Demo Panel */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground mb-4 text-center md:text-left">Interactive Demo Panel</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="contentType" className="text-foreground/90">Choose Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType} disabled={isPending}>
                    <SelectTrigger className="w-full bg-input border-border focus:ring-rose-500">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Blog">Blog Post / Article</SelectItem>
                      <SelectItem value="Tweet">Tweet / Social Media Post</SelectItem>
                      <SelectItem value="Email">Email Newsletter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label htmlFor="contentTopic" className="text-foreground/90">Enter Topic *</Label>
                  <Input
                    id="contentTopic"
                    value={contentTopic}
                    onChange={(e) => setContentTopic(e.target.value)}
                    placeholder="e.g., The future of renewable energy"
                    className="bg-input border-border focus:ring-rose-500"
                    required
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="tone" className="text-foreground/90">Choose Tone</Label>
                  <Select value={tone} onValueChange={setTone} disabled={isPending}>
                    <SelectTrigger className="w-full bg-input border-border focus:ring-rose-500">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Friendly">Friendly</SelectItem>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Witty">Witty</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={useSampleData} className="w-full sm:w-auto border-rose-500/50 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300" disabled={isPending}>
                        Use Sample Data
                    </Button>
                    <Button type="submit" className="w-full sm:flex-1 cta-button bg-rose-500 hover:bg-rose-600" disabled={isPending}>
                        {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Crafting Content...
                        </>
                        ) : (
                        <>
                            <SparklesIcon className="mr-2 h-4 w-4" /> Generate Content
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
                        <Loader2 className="h-12 w-12 text-rose-500 animate-spin" />
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
                           <Edit3 className="h-6 w-6 text-rose-400 mr-2"/>
                           <CardTitle className="text-xl text-rose-400">ContentCraft AI Generated:</CardTitle>
                        </div>
                        <pre className="whitespace-pre-wrap text-sm text-foreground bg-black/20 p-3 rounded-md mb-4">{result.simulatedResponse}</pre>
                         <Button variant="outline" onClick={handleTryAgain} className="mt-6 w-full border-rose-500/50 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300">
                            <RefreshCw className="mr-2 h-4 w-4" /> Generate New Content
                        </Button>
                    </Card>
                )}
                 {!isPending && !result && !error && (
                    <div className="text-center text-muted-foreground py-10 border border-dashed border-border rounded-lg">
                        <Edit3 size={48} className="mx-auto mb-2 opacity-30" />
                        <p>Enter a topic and click "Generate Content" to see ContentCraft AI in action.</p>
                    </div>
                )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-8 border-t border-rose-500/20">
            <Button size="lg" className="cta-button bg-rose-600 hover:bg-rose-700 w-full sm:w-auto" asChild>
                <Link href="#contact"><SparklesIcon className="mr-2 h-5 w-5" /> Try Full 1-Day Demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-rose-500/70 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 w-full sm:w-auto" asChild>
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

