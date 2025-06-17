
'use server';
/**
 * @fileOverview Simulates ScheduleSync AI for interactive demos.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const ScheduleSyncInputSchema = z.object({
  preferredDays: z.string().min(3).describe('User-specified preferred days, e.g., "Next Mon, Tue"'),
  preferredTime: z.string().optional().describe('User-specified preferred time, e.g., "Afternoon"'),
  attendeeEmails: z.string().min(5).describe('Comma-separated list of attendee emails.'),
  meetingTopic: z.string().min(3).describe('The topic of the meeting.'),
});
export type ScheduleSyncInput = z.infer<typeof ScheduleSyncInputSchema>;

const ScheduleSyncOutputSchema = z.object({
  suggestedSlot: z.string().describe('AI-suggested meeting slot.'),
  confirmationMessage: z.string().describe('A mock confirmation message.'),
});
export type ScheduleSyncOutput = z.infer<typeof ScheduleSyncOutputSchema>;

export async function demoScheduleSync(input: ScheduleSyncInput): Promise<ScheduleSyncOutput> {
  return demoScheduleSyncFlow(input);
}

const promptTemplate = ai.definePrompt({
  name: 'demoScheduleSyncPrompt',
  input: { schema: ScheduleSyncInputSchema },
  output: { schema: ScheduleSyncOutputSchema },
  prompt: `You are ScheduleSync AI. A user wants to schedule a meeting.
Details:
- Preferred Days: {{preferredDays}}
- Preferred Time: {{preferredTime}}
- Attendees: {{attendeeEmails}}
- Topic: {{meetingTopic}}

Find a suitable (mock) meeting slot and generate a confirmation message.
Example Output:
{
  "suggestedSlot": "Next Tuesday at 3:00 PM",
  "confirmationMessage": "Great! Your meeting '{{meetingTopic}}' with {{attendeeEmails}} has been tentatively scheduled for Next Tuesday at 3:00 PM. Invites will be sent upon confirmation."
}
`,
});

const demoScheduleSyncFlow = ai.defineFlow(
  {
    name: 'demoScheduleSyncFlow',
    inputSchema: ScheduleSyncInputSchema,
    outputSchema: ScheduleSyncOutputSchema,
  },
  async (input) => {
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay
    
    const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeOptions = ["10:00 AM", "2:30 PM", "4:00 PM", "11:30 AM"];
    
    const randomDay = input.preferredDays.includes("Mon") ? "Monday" : dayOptions[Math.floor(Math.random() * dayOptions.length)];
    const randomTime = input.preferredTime || timeOptions[Math.floor(Math.random() * timeOptions.length)];
    
    const suggestedSlot = `Next ${randomDay} at ${randomTime}`;
    
    return {
      suggestedSlot: suggestedSlot,
      confirmationMessage: `Got it! I've found a spot for your meeting "${input.meetingTopic}" with ${input.attendeeEmails}. How does ${suggestedSlot} sound? Once confirmed, invites will be sent.`,
    };
  }
);
