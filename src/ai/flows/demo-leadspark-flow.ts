
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
  companyDescription: z.string().describe('A description of the company or lead query.'),
});
export type DemoLeadSparkInput = z.infer<typeof DemoLeadSparkInputSchema>;

const DemoLeadSparkOutputSchema = z.object({
  qualification: z.enum(["HOT", "WARM", "COLD"]).describe('The qualification status of the lead.'),
  category: z.string().describe('The business category of the lead.'),
  suggestedEmail: z.string().describe('A short suggested outreach email.'),
  enrichmentData: z.object({
    linkedIn: z.string().describe('Placeholder LinkedIn URL.'),
    companySize: z.string().describe('Placeholder company size.'),
    website: z.string().describe('Placeholder website URL.'),
  }).describe('Placeholder enrichment data.'),
   analysisTime: z.string().describe('Simulated analysis time message.')
});
export type DemoLeadSparkOutput = z.infer<typeof DemoLeadSparkOutputSchema>;

export async function demoLeadSpark(input: DemoLeadSparkInput): Promise<DemoLeadSparkOutput> {
  return demoLeadSparkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'demoLeadSparkPrompt',
  input: { schema: DemoLeadSparkInputSchema },
  output: { schema: DemoLeadSparkOutputSchema },
  prompt: `You are LeadSpark AI. A user has provided the following company description or lead query:
"{{companyDescription}}"

Based on this, generate the following:
1.  A lead qualification: Choose one from "HOT", "WARM", or "COLD".
2.  A business category (e.g., "E-commerce / DTC Brand", "SaaS Startup", "Local Service Business").
3.  A short suggested outreach email (1-2 sentences).
4.  Placeholder enrichment data:
    *   linkedIn: Generate a plausible but fake LinkedIn profile URL (e.g., "linkedin.com/in/johndoe-example").
    *   companySize: Provide a common company size range (e.g., "11-50 employees", "1-10 employees", "50-200 employees").
    *   website: Generate a plausible but fake website URL (e.g., "examplecompany.io").
5.  analysisTime: "LeadSpark AI generated this within X seconds.", where X is a random small number between 2 and 5.

Return the output in the specified JSON format.
Example for a fashion e-commerce query:
Qualification: HOT
Category: E-commerce / DTC Brand
Suggested Email: "Hi there, I saw you're in fashion e-commerce. Our AI can help boost your marketing. Interested in a quick chat?"
Enrichment Data:
  LinkedIn: linkedin.com/in/fashionlead-example
  Company Size: 11-50 employees
  Website: fashionbrandexample.com
Analysis Time: LeadSpark AI generated this within 3 seconds.
`,
});

const demoLeadSparkFlow = ai.defineFlow(
  {
    name: 'demoLeadSparkFlow',
    inputSchema: DemoLeadSparkInputSchema,
    outputSchema: DemoLeadSparkOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    // Add a small random delay for simulated analysis time
    const randomSeconds = Math.floor(Math.random() * 4) + 2; // 2 to 5 seconds
    return {
        ...output!,
        analysisTime: `LeadSpark AI generated this within ${randomSeconds} seconds.`
    };
  }
);

