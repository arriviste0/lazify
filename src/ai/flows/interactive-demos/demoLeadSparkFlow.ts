
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
3.  A lead score (0-100). If the query mentions "LinkedIn" or specific positive keywords like "AI", "New York", "Software", "VP", "Director", "Founder", score higher. If vague, score lower.
4.  Brief reasoning for the score.
5.  A CRM preview object with status, contactEmail (fake but plausible), and notes.

Return the output in the specified JSON format.
Example:
Input: "Software company specializing in AI based in New York with 50-200 employees, looking for VP of Marketing"
Output:
{
  "leadName": "Alex Chen",
  "companyName": "InnovateAI Solutions",
  "leadScore": 88,
  "scoreReasoning": "Specific industry (AI), location (New York), company size, and role (VP) indicate a very strong potential match.",
  "crmPreview": {
    "status": "New",
    "contactEmail": "alex.chen@example.com",
    "notes": "VP Marketing at InnovateAI Solutions (NY, AI, 50-200 employees). From LeadSpark query."
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
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

    const query = input.leadQuery.toLowerCase();
    let score = 30 + Math.floor(Math.random() * 20); // Base score for vague query
    let reasoning = "General query, moderate potential. Further details would improve scoring.";
    let leadName = "Jane Doe";
    let companyName = "Generic Corp Ltd.";
    let contactEmail = `jane.d@${companyName.replace(" Ltd.", "").toLowerCase().replace(/\s+/g, '')}.com`;
    let notes = `Lead generated from demo query: '${input.leadQuery.substring(0,50)}...'`;
    let status: LeadSparkOutput["crmPreview"]["status"] = "New";

    if (query.includes("linkedin.com/in/")) {
      score = 70 + Math.floor(Math.random() * 15);
      reasoning = "Direct LinkedIn profile provided, high potential for data extraction and qualification.";
      const profileName = query.split("/in/")[1]?.split("/")[0]?.replace(/-/g, " ") || "LinkedIn User";
      leadName = profileName.replace(/\b\w/g, l => l.toUpperCase());
      companyName = `${leadName.split(" ")[0]} Global Solutions`;
      contactEmail = `${leadName.split(" ")[0].toLowerCase()}@${companyName.replace(" Global Solutions", "").toLowerCase()}.com`;
      notes = `Lead from LinkedIn profile: ${input.leadQuery}`;
      status = Math.random() > 0.6 ? "Qualified" : "New";
    } else {
        if (query.includes("ai") || query.includes("artificial intelligence")) { score += 15; reasoning += " AI focus increases relevance.";}
        if (query.includes("new york")|| query.includes("nyc") || query.includes("london") || query.includes("sf") || query.includes("san francisco")) { score += 10; reasoning += " Prime location noted.";}
        if (query.includes("software") || query.includes("tech") || query.includes("saas")) { score += 10; reasoning += " Tech industry match.";}
        if (query.includes("vp") || query.includes("director") || query.includes("manager")|| query.includes("founder") || query.includes("ceo")) { score += 15; reasoning += " Senior role specified.";}
        if (query.includes("startup")) { score += 5; reasoning += " Startup context."; }
        if (query.includes("enterprise")) { score += 8; reasoning += " Enterprise context."; }
        
        if (score > 85) {
            leadName = "Dr. Eva Rostova"; companyName = "QuantumLeap AI"; contactEmail = "eva.r@quantumleap.ai";
            notes = "High-potential lead matching multiple specific criteria from query.";
            status = "Qualified";
        } else if (score > 65) {
            leadName = "Mark Olsen"; companyName = "CodeCrafters Solutions"; contactEmail = "mark.o@codecrafters.io";
            notes = "Good match for software solutions. Query: " + input.leadQuery.substring(0,50);
            status = "Nurturing";
        } else if (score > 45) {
            leadName = "Sarah Woods"; companyName = "Innovatech Systems"; contactEmail = "s.woods@innovatech.sys";
            notes = "Moderate potential based on query: " + input.leadQuery.substring(0,50);
            status = "Contacted";
        }
    }
    score = Math.min(100, Math.max(0, score)); // Clamp score

    return {
      leadName,
      companyName,
      leadScore: score,
      scoreReasoning: reasoning.trim(),
      crmPreview: {
        status,
        contactEmail,
        notes,
      },
    };
  }
);

    
