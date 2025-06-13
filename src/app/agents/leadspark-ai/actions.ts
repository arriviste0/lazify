
'use server';

import type { DemoLeadSparkInput, DemoLeadSparkOutput } from '@/ai/flows/demo-leadspark-flow';
import { demoLeadSpark } from '@/ai/flows/demo-leadspark-flow';

export async function handleLeadSparkDemoAction(input: DemoLeadSparkInput): Promise<DemoLeadSparkOutput | { error: string }> {
  try {
    const result = await demoLeadSpark(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoLeadSpark server action:", e);
    return { error: e.message || "An unexpected error occurred." };
  }
}
