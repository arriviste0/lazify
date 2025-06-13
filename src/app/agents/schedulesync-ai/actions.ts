
'use server';

import type { DemoScheduleSyncInput, DemoScheduleSyncOutput } from '@/ai/flows/demo-schedulesync-flow';
import { demoScheduleSync } from '@/ai/flows/demo-schedulesync-flow';

export async function handleScheduleSyncDemoAction(input: DemoScheduleSyncInput): Promise<DemoScheduleSyncOutput | { error: string }> {
  try {
    const result = await demoScheduleSync(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoScheduleSync server action:", e);
    return { error: e.message || "An unexpected error occurred." };
  }
}
