
"use server";

import type { LeadSparkInput, LeadSparkOutput } from "@/ai/flows/interactive-demos/demoLeadSparkFlow";
import { demoLeadSpark } from "@/ai/flows/interactive-demos/demoLeadSparkFlow";

export async function handleLeadSparkAction(input: LeadSparkInput): Promise<LeadSparkOutput | { error: string }> {
  try {
    const result = await demoLeadSpark(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoLeadSpark server action:", e);
    return { error: e.message || "An unexpected error occurred qualifying lead." };
  }
}
