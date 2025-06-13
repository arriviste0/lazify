
'use server';

import type { DemoContentCraftInput, DemoContentCraftOutput } from '@/ai/flows/demo-contentcraft-flow';
import { demoContentCraft } from '@/ai/flows/demo-contentcraft-flow';

export async function handleContentCraftDemoAction(input: DemoContentCraftInput): Promise<DemoContentCraftOutput | { error: string }> {
  try {
    const result = await demoContentCraft(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoContentCraft server action:", e);
    return { error: e.message || "An unexpected error occurred." };
  }
}
