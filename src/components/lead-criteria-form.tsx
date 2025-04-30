'use client';

import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react'; // Added Wand2 icon

interface LeadCriteriaFormProps {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

export function LeadCriteriaForm({ onSubmit, isLoading }: LeadCriteriaFormProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt);
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border hover:shadow-xl transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          Define Your Ideal Lead
          </CardTitle>
        <CardDescription>
          Describe the criteria for the leads you want to generate. Be specific about industry, location, company size, role, or needs. The more detail, the better the results!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lead-prompt" className="font-semibold">Lead Criteria Prompt</Label>
            <Textarea
              id="lead-prompt"
              placeholder="e.g., 'Tech startups in Austin, TX with 10-50 employees that recently secured funding and need a digital marketing agency.' or 'Restaurants in Chicago looking for point-of-sale (POS) system upgrades.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none focus:border-primary focus:ring-primary"
              disabled={isLoading}
              aria-required="true"
            />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-colors" disabled={isLoading || !prompt.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Leads...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                 Generate Leads
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
