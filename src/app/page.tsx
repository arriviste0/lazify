'use client';

import type { GenerateLeadFromPromptOutput } from '@/ai/flows/generate-lead-from-prompt';
import { useState } from 'react';
import { LeadCriteriaForm } from '@/components/lead-criteria-form';
import { LeadCard } from '@/components/lead-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { generateLeadsAction } from '@/app/actions';

export default function Home() {
  const [leads, setLeads] = useState<GenerateLeadFromPromptOutput['leads']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLeads = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setLeads([]); // Clear previous leads

    try {
      const result = await generateLeadsAction(prompt);
      if (result.error) {
        setError(result.error);
        setLeads([]);
      } else {
        setLeads(result.data?.leads || []);
        if (!result.data?.leads || result.data.leads.length === 0) {
          setError('No leads generated. Try refining your criteria.');
        }
      }
    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred. Please try again.');
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-accent" />
          LeadGenius AI
        </h1>
        <p className="text-lg text-muted-foreground">
          Generate unlimited agency leads with the power of AI.
        </p>
      </header>

      <section className="mb-12">
        <LeadCriteriaForm onSubmit={handleGenerateLeads} isLoading={isLoading} />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Generated Leads</h2>

        {error && (
          <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col space-y-3 p-4 border rounded-lg bg-card">
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-4 w-1/4 rounded" />
                 <Skeleton className="h-4 w-full rounded mt-2" />
                 <Skeleton className="h-4 w-full rounded" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && leads.length === 0 && (
          <p className="text-center text-muted-foreground">
            Enter your criteria above and click "Generate Leads" to start.
          </p>
        )}

        {!isLoading && leads.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map((lead, index) => (
              <LeadCard
                key={`${lead.companyName}-${lead.email || index}`} // More robust key
                companyName={lead.companyName}
                contactPerson={lead.contactPerson}
                relevanceScore={lead.relevanceScore}
                contactNumber={lead.contactNumber}
                email={lead.email}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
