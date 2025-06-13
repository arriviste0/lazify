
'use server';

import type { DemoInboxZeroInput, DemoInboxZeroOutput } from '@/ai/flows/demo-inboxzero-flow';
import { demoInboxZero } from '@/ai/flows/demo-inboxzero-flow';

export async function handleInboxZeroDemoAction(input: DemoInboxZeroInput): Promise<DemoInboxZeroOutput | { error: string }> {
  try {
    const result = await demoInboxZero(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoInboxZero server action:", e);
    return { error: e.message || "An unexpected error occurred." };
  }
}
