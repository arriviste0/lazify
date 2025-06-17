
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
If a task mentions a deadline (e.g., "by Friday", "EOD", "urgent"), it's likely "High".
If a task seems routine (e.g., "buy groceries", "read news"), it might be "Medium" or "Low".
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
      let priority: "High" | "Medium" | "Low";
      const taskLower = task.toLowerCase();

      if (taskLower.match(/by\s+(eod|end of day|today|tonight|friday|monday|tuesday|wednesday|thursday)/i) || taskLower.match(/deadline/i) || taskLower.match(/urgent/i) || taskLower.match(/asap/i)) {
        priority = "High";
      } else if (taskLower.match(/report|client|project|presentation|meeting|call with|follow up|review/i)) {
        priority = "Medium";
      } else if (taskLower.match(/buy|groceries|plan|research|read|clean|organize/i)) {
         priority = (Math.random() > 0.6) ? "Medium" : "Low";
      } else {
        priority = priorities[Math.floor(Math.random() * 3)];
      }
      return { task, priority };
    });

    prioritizedTasks.sort((a, b) => {
        const pValue = (p: string) => (p === "High" ? 3 : p === "Medium" ? 2 : 1);
        return pValue(b.priority) - pValue(a.priority);
    });
    
    const highPriorityCount = prioritizedTasks.filter(t => t.priority === "High").length;
    const mediumPriorityCount = prioritizedTasks.filter(t => t.priority === "Medium").length;
    let summary = "";

    if (highPriorityCount > 1) {
        summary = `You have ${highPriorityCount} high priority tasks. Tackle these first!`;
    } else if (highPriorityCount === 1) {
        summary = `Focus on your high priority task: "${prioritizedTasks.find(t=>t.priority === "High")?.task}".`;
    } else if (mediumPriorityCount > 0) {
        summary = `Good job, no high priority tasks! Start with your ${mediumPriorityCount} medium priority items.`;
    } else if (prioritizedTasks.length > 0) {
        summary = "Looks like a manageable list. Pick one and get started!";
    } else {
        summary = "No tasks entered. Add some tasks to prioritize!";
    }


    return {
      prioritizedTasks,
      summary,
    };
  }
);

    