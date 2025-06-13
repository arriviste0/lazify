
'use server';

import type { DemoTaskMasterInput, DemoTaskMasterOutput } from '@/ai/flows/demo-taskmaster-flow';
import { demoTaskMaster } from '@/ai/flows/demo-taskmaster-flow';

export async function handleTaskMasterDemoAction(input: DemoTaskMasterInput): Promise<DemoTaskMasterOutput | { error: string }> {
  try {
    const result = await demoTaskMaster(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoTaskMaster server action:", e);
    return { error: e.message || "An unexpected error occurred." };
  }
}
