
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
    const timeOptions = ["10:00 AM", "2:30 PM", "4:00 PM", "11:30 AM", "3:15 PM", "9:30 AM"];
    
    let randomDay = dayOptions[Math.floor(Math.random() * dayOptions.length)];
    if (input.preferredDays.toLowerCase().includes("mon")) randomDay = "Monday";
    else if (input.preferredDays.toLowerCase().includes("tue")) randomDay = "Tuesday";
    else if (input.preferredDays.toLowerCase().includes("wed")) randomDay = "Wednesday";
    else if (input.preferredDays.toLowerCase().includes("thu")) randomDay = "Thursday";
    else if (input.preferredDays.toLowerCase().includes("fri")) randomDay = "Friday";
    else if (input.preferredDays.toLowerCase().includes("weekend")) randomDay = Math.random() > 0.5 ? "Saturday" : "Sunday";


    let randomTime = timeOptions[Math.floor(Math.random() * timeOptions.length)];
    if (input.preferredTime?.toLowerCase().includes("morning")) randomTime = Math.random() > 0.5 ? "10:00 AM" : "11:30 AM";
    else if (input.preferredTime?.toLowerCase().includes("afternoon")) randomTime = Math.random() > 0.5 ? "2:30 PM" : "3:45 PM";
    else if (input.preferredTime?.toLowerCase().includes("evening")) randomTime = Math.random() > 0.5 ? "5:00 PM" : "6:30 PM";
    
    const suggestedSlot = `Next ${randomDay} at ${randomTime}`;
    const attendeeList = input.attendeeEmails.split(',').map(e => e.trim()).filter(e => e).join(', ');
    
    return {
      suggestedSlot: suggestedSlot,
      confirmationMessage: `Got it! I've found a spot for your meeting "${input.meetingTopic}" with ${attendeeList || 'your attendees'}. How does ${suggestedSlot} sound? Once confirmed, invites will be sent.`,
    };
  }
);

    