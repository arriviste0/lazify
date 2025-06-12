
'use server';
/**
 * @fileOverview A demo flow for LeadSpark AI.
 *
 * - demoLeadSpark - A function that simulates LeadSpark AI.
 * - DemoLeadSparkInput - The input type for the demoLeadSpark function.
 * - DemoLeadSparkOutput - The return type for the demoLeadSpark function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const DemoLeadSparkInputSchema = z.object({
  customerProfile: z.string().describe('A description of the ideal customer profile.'),
});
export type DemoLeadSparkInput = z.infer<typeof DemoLeadSparkInputSchema>;

const DemoLeadSparkOutputSchema = z.object({
  simulatedResponse: z.string().describe('A simulated list of leads or lead generation ideas from LeadSpark AI.'),
});
export type DemoLeadSparkOutput = z.infer<typeof DemoLeadSparkOutputSchema>;

export async function demoLeadSpark(input: DemoLeadSparkInput): Promise<DemoLeadSparkOutput> {
  return demoLeadSparkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'demoLeadSparkPrompt',
  input: { schema: DemoLeadSparkInputSchema },
  output: { schema: DemoLeadSparkOutputSchema },
  prompt: `You are LeadSpark AI. A user has described their ideal customer: "{{customerProfile}}".
  Generate a short, bulleted list of 3-5 example lead types or lead generation ideas based on this profile.
  Format the output as a single string.
  Keep the response concise and helpful for a demo.`,
});

const demoLeadSparkFlow = ai.defineFlow(
  {
    name: 'demoLeadSparkFlow',
    inputSchema: DemoLeadSparkInputSchema,
    outputSchema: DemoLeadSparkOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
