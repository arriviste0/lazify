
'use server';
/**
 * @fileOverview A demo flow for InboxZero AI.
 *
 * - demoInboxZero - A function that simulates InboxZero AI.
 * - DemoInboxZeroInput - The input type.
 * - DemoInboxZeroOutput - The output type.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const DemoInboxZeroInputSchema = z.object({
  emailContent: z.string().describe('The content of a sample email.'),
});
export type DemoInboxZeroInput = z.infer<typeof DemoInboxZeroInputSchema>;

const DemoInboxZeroOutputSchema = z.object({
  simulatedResponse: z.string().describe('A simulated categorization or reply suggestion from InboxZero AI.'),
});
export type DemoInboxZeroOutput = z.infer<typeof DemoInboxZeroOutputSchema>;

export async function demoInboxZero(input: DemoInboxZeroInput): Promise<DemoInboxZeroOutput> {
  return demoInboxZeroFlow(input);
}

const prompt = ai.definePrompt({
  name: 'demoInboxZeroPrompt',
  input: { schema: DemoInboxZeroInputSchema },
  output: { schema: DemoInboxZeroOutputSchema },
  prompt: `You are InboxZero AI. A user has pasted the following email content:
---
{{emailContent}}
---
Provide a very brief suggested categorization for this email (e.g., "Priority", "Follow-up Required", "For Review", "Archive Candidate") AND a one-sentence draft reply idea or action.
Format the output as a single string.
Keep the response concise and helpful for a demo.`,
});

const demoInboxZeroFlow = ai.defineFlow(
  {
    name: 'demoInboxZeroFlow',
    inputSchema: DemoInboxZeroInputSchema,
    outputSchema: DemoInboxZeroOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
