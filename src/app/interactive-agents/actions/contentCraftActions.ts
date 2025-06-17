
"use server";

import type { ContentCraftInput, ContentCraftOutput } from "@/ai/flows/interactive-demos/demoContentCraftFlow";
import { demoContentCraft } from "@/ai/flows/interactive-demos/demoContentCraftFlow";

export async function handleContentCraftAction(input: ContentCraftInput): Promise<ContentCraftOutput | { error: string }> {
  try {
    const result = await demoContentCraft(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoContentCraft server action:", e);
    return { error: e.message || "An unexpected error occurred generating content." };
  }
}
