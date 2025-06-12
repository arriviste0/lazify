
'use server';
/**
 * @fileOverview A demo flow for TaskMaster AI.
 *
 * - demoTaskMaster - A function that simulates TaskMaster AI.
 * - DemoTaskMasterInput - The input type.
 * - DemoTaskMasterOutput - The output type.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const DemoTaskMasterInputSchema = z.object({
  taskDescription: z.string().describe('A description of the task to be organized.'),
});
export type DemoTaskMasterInput = z.infer<typeof DemoTaskMasterInputSchema>;

const DemoTaskMasterOutputSchema = z.object({
  simulatedResponse: z.string().describe('A simulated list of sub-tasks or organizational tips from TaskMaster AI.'),
});
export type DemoTaskMasterOutput = z.infer<typeof DemoTaskMasterOutputSchema>;

export async function demoTaskMaster(input: DemoTaskMasterInput): Promise<DemoTaskMasterOutput> {
  return demoTaskMasterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'demoTaskMasterPrompt',
  input: { schema: DemoTaskMasterInputSchema },
  output: { schema: DemoTaskMasterOutputSchema },
  prompt: `You are TaskMaster AI. A user needs help organizing the following task: "{{taskDescription}}".
  Break this task down into 2-3 simple, actionable sub-tasks OR provide one quick organizational tip related to the task.
  Format the output as a single string.
  Keep the response concise and helpful for a demo.`,
});

const demoTaskMasterFlow = ai.defineFlow(
  {
    name: 'demoTaskMasterFlow',
    inputSchema: DemoTaskMasterInputSchema,
    outputSchema: DemoTaskMasterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
