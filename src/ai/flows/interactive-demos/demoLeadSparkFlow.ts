
'use server';
/**
 * @fileOverview Simulates LeadSpark AI for interactive demos.
 *
 * - demoLeadSpark - A function that simulates LeadSpark AI.
 * - LeadSparkInput - The input type.
 * - LeadSparkOutput - The output type.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const LeadSparkInputSchema = z.object({
  leadQuery: z.string().min(5, { message: "Lead query must be at least 5 characters." }).describe('User query for a lead, e.g., company name, industry, or LinkedIn URL.'),
});
export type LeadSparkInput = z.infer<typeof LeadSparkInputSchema>;

const LeadSparkOutputSchema = z.object({
  leadName: z.string().describe('Generated or extracted lead name.'),
  companyName: z.string().describe('Generated or extracted company name.'),
  leadScore: z.number().min(0).max(100).describe('A score from 0-100 indicating lead quality.'),
  scoreReasoning: z.string().describe('Brief reasoning for the lead score.'),
  crmPreview: z.object({
    status: z.enum(["New", "Contacted", "Qualified", "Nurturing"]).describe("Lead status in CRM."),
    contactEmail: z.string().email().optional().describe("Lead's email if found."),
    notes: z.string().optional().describe("Brief notes for CRM entry."),
  }).describe('A preview of how the lead might look in a CRM.'),
});
export type LeadSparkOutput = z.infer<typeof LeadSparkOutputSchema>;

export async function demoLeadSpark(input: LeadSparkInput): Promise<LeadSparkOutput> {
  return demoLeadSparkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'demoLeadSparkPrompt',
  input: { schema: LeadSparkInputSchema },
  output: { schema: LeadSparkOutputSchema },
  prompt: `You are LeadSpark AI. A user has provided the following lead query: "{{leadQuery}}".

Based on this, generate:
1.  A plausible lead name.
2.  A plausible company name.
3.  A lead score (0-100). If the query mentions "LinkedIn" or specific positive keywords like "AI", "New York", "Software", score higher. If vague, score lower.
4.  Brief reasoning for the score.
5.  A CRM preview object with status, contactEmail (fake but plausible), and notes.

Return the output in the specified JSON format.
Example:
Input: "Software company specializing in AI based in New York with 50-200 employees"
Output:
{
  "leadName": "Alex Chen",
  "companyName": "InnovateAI Solutions",
  "leadScore": 85,
  "scoreReasoning": "Specific industry (AI), location (New York), and company size indicate a strong potential match.",
  "crmPreview": {
    "status": "New",
    "contactEmail": "alex.chen@example.com",
    "notes": "Interested in AI solutions, based in NY, 50-200 employees. From LeadSpark query."
  }
}
`,
});

const demoLeadSparkFlow = ai.defineFlow(
  {
    name: 'demoLeadSparkFlow',
    inputSchema: LeadSparkInputSchema,
    outputSchema: LeadSparkOutputSchema,
  },
  async (input) => {
    // Simulate some processing delay
    await new Promise(resolve => setTimeout(resolve, 700));

    let score = 50;
    let reasoning = "General query, moderate potential.";
    let leadName = "Jane Doe";
    let companyName = "Generic Corp";
    let contactEmail = "jane.doe@example.com";
    let notes = "Lead generated from demo query.";

    if (input.leadQuery.toLowerCase().includes("linkedin.com/in/")) {
      score = 85;
      reasoning = "Direct LinkedIn profile provided, high potential for data extraction.";
      leadName = input.leadQuery.split("/in/")[1].split("/")[0].replace("-"," ").replace(/\b\w/g, l => l.toUpperCase()); // Extract name from URL
      companyName = `${leadName.split(" ")[0]} Industries`;
      contactEmail = `${leadName.split(" ")[0].toLowerCase()}@${companyName.replace(" Industries", "").toLowerCase()}.com`;
      notes = `Lead from LinkedIn profile: ${input.leadQuery}`;
    } else if (input.leadQuery.toLowerCase().includes("ai") && input.leadQuery.toLowerCase().includes("new york")) {
      score = 90;
      reasoning = "Specific industry (AI) and location (New York) match target criteria.";
      leadName = "Dr. Eva Rostova";
      companyName = "NY AI Dynamics";
      contactEmail = "eva.r@nyai.dev";
      notes = "Strong match for AI solutions in NY.";
    } else if (input.leadQuery.toLowerCase().includes("software")) {
      score = 70;
      reasoning = "Industry (Software) specified, good potential.";
      leadName = "Mark Olsen";
      companyName = "CodeCrafters Inc.";
      contactEmail = "mark.olsen@codecrafters.io";
      notes = "Software company, needs further qualification.";
    }


    return {
      leadName: leadName,
      companyName: companyName,
      leadScore: score,
      scoreReasoning: reasoning,
      crmPreview: {
        status: "New",
        contactEmail: contactEmail,
        notes: notes,
      },
    };
  }
);
