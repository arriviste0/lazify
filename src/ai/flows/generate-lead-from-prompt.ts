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
      relevanceScore: z.number().describe('A score indicating how well the lead matches the criteria (0-100).'),
      contactNumber: z.string().optional().describe('The primary contact phone number for the lead. Include if available.'),
      email: z.string().optional().describe('The primary contact email address for the lead. Include if available.'),
      location: z.string().optional().describe('The physical address or general location (e.g., "San Francisco, CA") of the company. Include if available for mapping purposes.'),
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
          relevanceScore: z.number().describe('A score indicating how well the lead matches the criteria (0-100).'),
          contactNumber: z.string().optional().describe('The primary contact phone number for the lead.'),
          email: z.string().optional().describe('The primary contact email address for the lead.'),
          location: z.string().optional().describe('The physical address or general location (e.g., "City, State") of the company for mapping.'),
        })
      ).describe('A list of potential leads that match the criteria.'),
    }),
  },
  prompt: `You are an AI agent specializing in generating leads for agencies. Based on the provided criteria, generate a list of potential leads.

Criteria: {{{prompt}}}

For each lead, include the company name, a contact person, a relevance score (0-100), and if available, a contact phone number, email address, and the company's location (address or city/state). The location is important for mapping.

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
  // Ensure relevance score is within 0-100 range, default to 0 if invalid
  if (output?.leads) {
    output.leads = output.leads.map(lead => ({
      ...lead,
      relevanceScore: Math.max(0, Math.min(100, lead.relevanceScore ?? 0)),
    }));
  }
  return output!;
});
