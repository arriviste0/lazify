
'use server';
/**
 * @fileOverview A demo flow for ContentCraft AI.
 *
 * - demoContentCraft - A function that simulates ContentCraft AI.
 * - DemoContentCraftInput - The input type.
 * - DemoContentCraftOutput - The output type.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const DemoContentCraftInputSchema = z.object({
  contentTopic: z.string().describe('The topic for which content needs to be generated.'),
});
export type DemoContentCraftInput = z.infer<typeof DemoContentCraftInputSchema>;

const DemoContentCraftOutputSchema = z.object({
  simulatedResponse: z.string().describe('A simulated content snippet from ContentCraft AI.'),
});
export type DemoContentCraftOutput = z.infer<typeof DemoContentCraftOutputSchema>;

export async function demoContentCraft(input: DemoContentCraftInput): Promise<DemoContentCraftOutput> {
  return demoContentCraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'demoContentCraftPrompt',
  input: { schema: DemoContentCraftInputSchema },
  output: { schema: DemoContentCraftOutputSchema },
  prompt: `You are ContentCraft AI. A user wants content for the following topic: "{{contentTopic}}".
  Generate a short, engaging paragraph (2-3 sentences) OR 3-4 bullet points related to this topic.
  Format the output as a single string.
  Keep the response concise and helpful for a demo.`,
});

const demoContentCraftFlow = ai.defineFlow(
  {
    name: 'demoContentCraftFlow',
    inputSchema: DemoContentCraftInputSchema,
    outputSchema: DemoContentCraftOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
