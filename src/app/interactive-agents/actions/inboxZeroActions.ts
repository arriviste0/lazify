
"use server";

import type { InboxZeroInput, InboxZeroOutput } from "@/ai/flows/interactive-demos/demoInboxZeroFlow";
import { demoInboxZero } from "@/ai/flows/interactive-demos/demoInboxZeroFlow";

export async function handleInboxZeroAction(input: InboxZeroInput): Promise<InboxZeroOutput | { error: string }> {
  try {
    const result = await demoInboxZero(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoInboxZero server action:", e);
    return { error: e.message || "An unexpected error occurred processing emails." };
  }
}
