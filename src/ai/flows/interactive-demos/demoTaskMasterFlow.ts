
'use server';
/**
 * @fileOverview Simulates TaskMaster AI for interactive demos.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const TaskMasterInputSchema = z.object({
  tasks: z.string().min(5).describe('A string containing tasks, potentially one per line.'),
});
export type TaskMasterInput = z.infer<typeof TaskMasterInputSchema>;

const PrioritizedTaskSchema = z.object({
  task: z.string(),
  priority: z.enum(["High", "Medium", "Low"]),
});

const TaskMasterOutputSchema = z.object({
  prioritizedTasks: z.array(PrioritizedTaskSchema).describe('List of tasks with assigned priorities.'),
  summary: z.string().describe("A brief summary or tip about the task list.")
});
export type TaskMasterOutput = z.infer<typeof TaskMasterOutputSchema>;

export async function demoTaskMaster(input: TaskMasterInput): Promise<TaskMasterOutput> {
  return demoTaskMasterFlow(input);
}

const promptTemplate = ai.definePrompt({
  name: 'demoTaskMasterPrompt',
  input: { schema: TaskMasterInputSchema },
  output: { schema: TaskMasterOutputSchema },
  prompt: `You are TaskMaster AI. A user has provided the following list of tasks:
---
{{tasks}}
---
Analyze these tasks. For each task, assign a priority: "High", "Medium", or "Low".
If a task mentions a deadline (e.g., "by Friday", "EOD"), it's likely "High".
If a task seems routine (e.g., "buy groceries"), it might be "Medium" or "Low".
Return a list of these tasks with their assigned priorities. Also provide a one-sentence summary or tip.

Example Output:
{
  "prioritizedTasks": [
    { "task": "Finish Q3 report by Friday", "priority": "High" },
    { "task": "Email client about project update", "priority": "Medium" },
    { "task": "Buy groceries (milk, eggs, bread)", "priority": "Low" }
  ],
  "summary": "Focus on the Q3 report first due to its deadline."
}
`,
});

const demoTaskMasterFlow = ai.defineFlow(
  {
    name: 'demoTaskMasterFlow',
    inputSchema: TaskMasterInputSchema,
    outputSchema: TaskMasterOutputSchema,
  },
  async (input) => {
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

    const taskLines = input.tasks.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    const priorities: ("High" | "Medium" | "Low")[] = ["High", "Medium", "Low"];
    
    const prioritizedTasks = taskLines.map(task => {
      let priority: "High" | "Medium" | "Low" = priorities[Math.floor(Math.random() * 3)];
      if (task.match(/by\s+(friday|eod|tomorrow|monday|tuesday|wednesday|thursday)/i) || task.match(/deadline/i)) {
        priority = "High";
      } else if (task.match(/report|client|project|presentation|meeting/i)) {
        priority = "Medium";
      } else if (task.match(/buy|groceries|call|book|find hotel/i)) {
         priority = (Math.random() > 0.5) ? "Medium" : "Low";
      }
      return { task, priority };
    });

    // Simple sort: High > Medium > Low
    prioritizedTasks.sort((a, b) => {
        const pValue = (p: string) => (p === "High" ? 3 : p === "Medium" ? 2 : 1);
        return pValue(b.priority) - pValue(a.priority);
    });
    
    const highPriorityCount = prioritizedTasks.filter(t => t.priority === "High").length;

    return {
      prioritizedTasks,
      summary: highPriorityCount > 0 ? `You have ${highPriorityCount} high priority task(s) to focus on.` : "Tasks seem manageable. Start with the top ones!",
    };
  }
);
