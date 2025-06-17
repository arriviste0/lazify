
"use server";

import type { ScheduleSyncInput, ScheduleSyncOutput } from "@/ai/flows/interactive-demos/demoScheduleSyncFlow";
import { demoScheduleSync } from "@/ai/flows/interactive-demos/demoScheduleSyncFlow";

export async function handleScheduleSyncAction(input: ScheduleSyncInput): Promise<ScheduleSyncOutput | { error: string }> {
  try {
    const result = await demoScheduleSync(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoScheduleSync server action:", e);
    return { error: e.message || "An unexpected error occurred during scheduling." };
  }
}
