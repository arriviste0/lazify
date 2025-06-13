
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, ArrowLeft, Loader2 } from 'lucide-react';
import type { DemoLeadSparkInput } from '@/ai/flows/demo-leadspark-flow';
import { handleLeadSparkDemoAction } from './actions';

export default function LeadSparkDemoPage() {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    startTransition(async () => {
      const response = await handleLeadSparkDemoAction({ customerProfile: inputValue });
      if ('error' in response) {
        setError(response.error);
      } else {
        setResult(response.simulatedResponse);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-green-950/20 to-background py-8 px-4 md:px-6 flex flex-col items-center">
      <header className="w-full max-w-3xl mb-8 self-start md:self-center">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </header>

      <Card className="w-full max-w-3xl modern-card shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Users className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">LeadSpark AI Demo</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            See how LeadSpark AI can automatically identify and qualify potential leads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="customerProfile" className="block text-sm font-medium text-foreground mb-1">
                Describe your ideal customer profile:
              </label>
              <Textarea
                id="customerProfile"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g., Small e-commerce businesses in the fashion industry looking to improve their online marketing reach and sales."
                className="min-h-[100px] bg-input border-border focus:ring-primary"
                required
                disabled={isPending}
                suppressHydrationWarning
              />
            </div>
            <Button type="submit" className="w-full cta-button" disabled={isPending} suppressHydrationWarning>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Demo Leads'
              )}
            </Button>
          </form>

          {error && (
            <Card className="mt-6 bg-destructive/10 border-destructive text-destructive p-4">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-lg">Error</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p>{error}</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <Card className="mt-6 bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary">LeadSpark AI Says:</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm text-foreground bg-background/50 p-4 rounded-md">{result}</pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Lazify AI. This is a simulated demo.</p>
      </footer>
    </div>
  );
}
