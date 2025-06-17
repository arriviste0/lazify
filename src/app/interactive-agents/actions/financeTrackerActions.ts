
"use server";

import type { FinanceTrackerInput, FinanceTrackerOutput } from "@/ai/flows/interactive-demos/demoFinanceTrackerFlow";
import { demoFinanceTracker } from "@/ai/flows/interactive-demos/demoFinanceTrackerFlow";

export async function handleFinanceTrackerAction(input: FinanceTrackerInput): Promise<FinanceTrackerOutput | { error: string }> {
  try {
    const result = await demoFinanceTracker(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoFinanceTracker server action:", e);
    return { error: e.message || "An unexpected error occurred tracking finances." };
  }
}
