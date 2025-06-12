
'use server';
/**
 * @fileOverview A demo flow for ScheduleSync AI.
 *
 * - demoScheduleSync - A function that simulates ScheduleSync AI.
 * - DemoScheduleSyncInput - The input type.
 * - DemoScheduleSyncOutput - The output type.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const DemoScheduleSyncInputSchema = z.object({
  meetingDetails: z.string().describe('Details about the meeting to be scheduled.'),
});
export type DemoScheduleSyncInput = z.infer<typeof DemoScheduleSyncInputSchema>;

const DemoScheduleSyncOutputSchema = z.object({
  simulatedResponse: z.string().describe('A simulated confirmation message from ScheduleSync AI.'),
});
export type DemoScheduleSyncOutput = z.infer<typeof DemoScheduleSyncOutputSchema>;

export async function demoScheduleSync(input: DemoScheduleSyncInput): Promise<DemoScheduleSyncOutput> {
  return demoScheduleSyncFlow(input);
}

const prompt = ai.definePrompt({
  name: 'demoScheduleSyncPrompt',
  input: { schema: DemoScheduleSyncInputSchema },
  output: { schema: DemoScheduleSyncOutputSchema },
  prompt: `You are ScheduleSync AI. A user wants to schedule a meeting with the following details: "{{meetingDetails}}".
  Generate a short, friendly mock confirmation message as if the meeting has been successfully scheduled.
  Include a placeholder like "[Date]" and "[Time]".
  Format the output as a single string.
  Keep the response concise and helpful for a demo. For example: "Great! Your meeting '[brief summary of meetingDetails]' has been scheduled for [Date] at [Time]. Invites have been sent."`,
});

const demoScheduleSyncFlow = ai.defineFlow(
  {
    name: 'demoScheduleSyncFlow',
    inputSchema: DemoScheduleSyncInputSchema,
    outputSchema: DemoScheduleSyncOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
