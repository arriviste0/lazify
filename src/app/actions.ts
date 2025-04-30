// src/app/actions.ts
'use server';

import { generateLeadFromPrompt, GenerateLeadFromPromptOutput } from '@/ai/flows/generate-lead-from-prompt';

export async function generateLeadsAction(
  prompt: string
): Promise<{ data?: GenerateLeadFromPromptOutput; error?: string }> {
  try {
    // Basic input validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return { error: 'Invalid prompt provided.' };
    }

    const result = await generateLeadFromPrompt({ prompt });
    return { data: result };
  } catch (error) {
    console.error('Error in generateLeadsAction:', error);
    // Return a generic error message to the client for security
    return { error: 'Failed to generate leads due to an internal server error.' };
  }
}
