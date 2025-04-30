'use server';

/**
 * @fileOverview A lead generation AI agent that generates leads based on a prompt.
 *
 * - generateLeadFromPrompt - A function that handles the lead generation process.
 * - GenerateLeadFromPromptInput - The input type for the generateLeadFromPrompt function.
 * - GenerateLeadFromPromptOutput - The return type for the generateLeadFromPrompt function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateLeadFromPromptInputSchema = z.object({
  prompt: z.string().describe('The prompt describing the ideal lead criteria.'),
});
export type GenerateLeadFromPromptInput = z.infer<typeof GenerateLeadFromPromptInputSchema>;

const GenerateLeadFromPromptOutputSchema = z.object({
  leads: z.array(
    z.object({
      companyName: z.string().describe('The name of the company.'),
      contactPerson: z.string().describe('The name of the contact person at the company.'),
      relevanceScore: z.number().describe('A score indicating how well the lead matches the criteria.'),
    })
  ).describe('A list of potential leads that match the criteria.'),
});
export type GenerateLeadFromPromptOutput = z.infer<typeof GenerateLeadFromPromptOutputSchema>;

export async function generateLeadFromPrompt(input: GenerateLeadFromPromptInput): Promise<GenerateLeadFromPromptOutput> {
  return generateLeadFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLeadFromPromptPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The prompt describing the ideal lead criteria.'),
    }),
  },
  output: {
    schema: z.object({
      leads: z.array(
        z.object({
          companyName: z.string().describe('The name of the company.'),
          contactPerson: z.string().describe('The name of the contact person at the company.'),
          relevanceScore: z.number().describe('A score indicating how well the lead matches the criteria.'),
        })
      ).describe('A list of potential leads that match the criteria.'),
    }),
  },
  prompt: `You are an AI agent specializing in generating leads for agencies. Based on the provided criteria, generate a list of potential leads.

Criteria: {{{prompt}}}

Output the leads in a JSON format.
`,
});

const generateLeadFromPromptFlow = ai.defineFlow<
  typeof GenerateLeadFromPromptInputSchema,
  typeof GenerateLeadFromPromptOutputSchema
>({
  name: 'generateLeadFromPromptFlow',
  inputSchema: GenerateLeadFromPromptInputSchema,
  outputSchema: GenerateLeadFromPromptOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
