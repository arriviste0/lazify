
"use server";

import type { TaskMasterInput, TaskMasterOutput } from "@/ai/flows/interactive-demos/demoTaskMasterFlow";
import { demoTaskMaster } from "@/ai/flows/interactive-demos/demoTaskMasterFlow";

export async function handleTaskMasterAction(input: TaskMasterInput): Promise<TaskMasterOutput | { error: string }> {
  try {
    const result = await demoTaskMaster(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoTaskMaster server action:", e);
    return { error: e.message || "An unexpected error occurred prioritizing tasks." };
  }
}
