
'use server';

import type { DemoLeadSparkInput, DemoLeadSparkOutput } from '@/ai/flows/demo-leadspark-flow';
import { demoLeadSpark } from '@/ai/flows/demo-leadspark-flow';

export async function handleLeadSparkDemoAction(input: DemoLeadSparkInput): Promise<DemoLeadSparkOutput | { error: string }> {
  try {
    const result = await demoLeadSpark(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoLeadSpark server action:", e);
    // Attempt to parse Genkit's error structure if present
    let errorMessage = "An unexpected error occurred with LeadSpark AI.";
    if (e.details && typeof e.details === 'string') {
      try {
        const details = JSON.parse(e.details);
        if (details.message) errorMessage = details.message;
      } catch (parseError) {
        // If parsing fails, use the original message or fallback
         errorMessage = e.message || errorMessage;
      }
    } else if (e.message) {
      errorMessage = e.message;
    }
    return { error: errorMessage };
  }
}
