'use client';

import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Define Your Ideal Lead</CardTitle>
        <CardDescription>
          Describe the criteria for the leads you want to generate (e.g., industry, location, company size, specific needs). The more detail, the better!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lead-prompt">Lead Criteria Prompt</Label>
            <Textarea
              id="lead-prompt"
              placeholder="e.g., 'Generate leads for SaaS companies in California with 50-200 employees looking for marketing automation solutions.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={isLoading}
              aria-required="true"
            />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading || !prompt.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Leads'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
