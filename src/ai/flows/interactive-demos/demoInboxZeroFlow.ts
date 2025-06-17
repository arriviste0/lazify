
'use server';
/**
 * @fileOverview Simulates InboxZero AI for interactive demos.
 *
 * - demoInboxZero - A function that simulates InboxZero AI.
 * - InboxZeroInput - The input type.
 * - InboxZeroOutput - The output type.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const InboxZeroInputSchema = z.object({
  emailContent: z.string().min(10, { message: "Email content must be at least 10 characters." }).describe('The content of a sample email or multiple emails.'),
});
export type InboxZeroInput = z.infer<typeof InboxZeroInputSchema>;

const InboxZeroOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the email content.'),
  category: z.enum(["Important", "Needs Action", "FYI", "Archive", "Spam"]).describe('Suggested category for the email(s).'),
  actionItems: z.array(z.string()).optional().describe('Key action items extracted from the email.'),
});
export type InboxZeroOutput = z.infer<typeof InboxZeroOutputSchema>;

export async function demoInboxZero(input: InboxZeroInput): Promise<InboxZeroOutput> {
  return demoInboxZeroFlow(input);
}

const prompt = ai.definePrompt({
  name: 'demoInboxZeroPrompt',
  input: { schema: InboxZeroInputSchema },
  output: { schema: InboxZeroOutputSchema },
  prompt: `You are InboxZero AI. A user has provided the following email content:
---
{{emailContent}}
---
Based on this, provide:
1. A concise one-sentence summary of the email(s).
2. A suggested category: "Important", "Needs Action", "FYI", "Archive", or "Spam".
3. (Optional) A list of 1-3 key action items if any are present.

Return the output in the specified JSON format. Keep it brief for a demo.
Example:
Input: "Subject: Quick question about the TPS reports. Are they due EOD Friday or Monday? Thanks, Bob"
Output:
{
  "summary": "Bob is asking if the TPS reports are due EOD Friday or Monday.",
  "category": "Needs Action",
  "actionItems": ["Clarify TPS report deadline with Bob."]
}
`,
});

const demoInboxZeroFlow = ai.defineFlow(
  {
    name: 'demoInboxZeroFlow',
    inputSchema: InboxZeroInputSchema,
    outputSchema: InboxZeroOutputSchema,
  },
  async (input) => {
    // Simulate some processing delay
    await new Promise(resolve => setTimeout(resolve, 700));

    if (input.emailContent.toLowerCase().includes("urgent review needed")) {
        return {
            summary: "The email requests an urgent review of Project Phoenix financials and asks Sarah for marketing copy.",
            category: "Important",
            actionItems: [
                "Review Project Phoenix financials for regional tax calculation errors by EOD.",
                "Sarah to send finalized marketing copy for the newsletter by tomorrow morning."
            ]
        };
    }
     if (input.emailContent.toLowerCase().includes("meeting")) {
        return {
            summary: "The email is about scheduling a meeting.",
            category: "Needs Action",
            actionItems: ["Respond to meeting request", "Check calendar availability"]
        };
    }

    return {
      summary: "This email seems to be a general update or query.",
      category: "FYI",
      actionItems: ["Review for any follow-up needed."]
    };
  }
);
