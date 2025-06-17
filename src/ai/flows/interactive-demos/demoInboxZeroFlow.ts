
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
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

    const content = input.emailContent.toLowerCase();
    let summary = "The email provides a general update.";
    let category: InboxZeroOutput["category"] = "FYI";
    let actionItems: string[] = [];

    if (content.includes("urgent") || content.includes("critical") || content.includes("important") || content.includes("deadline eod")) {
      summary = "This email requires immediate attention due to urgent matters or deadlines mentioned.";
      category = "Important";
      actionItems.push("Address the urgent items mentioned in the email by EOD.");
      if (content.includes("review needed")) {
        actionItems.push("Review the document/item mentioned for urgent feedback.");
      }
       if (content.includes("meeting") || content.includes("schedule call")) {
        actionItems.push("Respond to meeting/call request mentioned urgently.");
      }
    } else if (content.includes("meeting") || content.includes("schedule call") || content.includes("confirm availability")) {
      summary = "This email pertains to scheduling or confirming a meeting/call.";
      category = "Needs Action";
      actionItems.push("Respond to the meeting/call coordination.");
      if (content.includes("availability")) {
        actionItems.push("Check your calendar and provide availability.");
      }
    } else if (content.includes("question") || content.includes("clarify") || content.includes("feedback")) {
      summary = "The email asks a question or seeks clarification/feedback.";
      category = "Needs Action";
      actionItems.push("Provide a response to the query or feedback request.");
    } else if (content.includes("newsletter") || content.includes("promotion") || content.includes("unsubscribe")) {
      summary = "This appears to be a newsletter or promotional email.";
      category = "Archive";
      if (Math.random() > 0.7) category = "Spam"; // Occasionally mark as spam
    } else if (content.length < 50 && content.includes("thanks")) {
        summary = "This is a short thank you note or acknowledgement.";
        category = "FYI";
    }

    if (actionItems.length === 0 && category === "FYI") {
        actionItems.push("Review for any minor follow-up if necessary.");
    }
    
    // Ensure some action items for "Needs Action" if none specific found
    if (category === "Needs Action" && actionItems.length === 0) {
        actionItems.push("Determine specific action required and respond accordingly.");
    }


    return {
      summary,
      category,
      actionItems: actionItems.length > 0 ? actionItems.slice(0,3) : undefined,
    };
  }
);

    