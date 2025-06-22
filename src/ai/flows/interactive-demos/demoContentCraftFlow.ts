/**
 * @fileOverview Simulates ContentCraft AI for interactive demos.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const ContentCraftInputSchema = z.object({
  prompt: z.string().min(10, { message: "Prompt must be at least 10 characters." }).describe('The user-provided prompt for content generation.'),
  contentType: z.enum(["blogPost", "socialMediaCaption", "productDescription", "emailDraft"]).describe("The type of content to generate."),
});
export type ContentCraftInput = z.infer<typeof ContentCraftInputSchema>;

const ContentCraftOutputSchema = z.object({
  generatedContent: z.string().describe('The AI-generated content.'),
  contentTypeUsed: ContentCraftInputSchema.shape.contentType.describe("The content type that was generated.")
});
export type ContentCraftOutput = z.infer<typeof ContentCraftOutputSchema>;

export async function demoContentCraft(input: ContentCraftInput): Promise<ContentCraftOutput> {
  return demoContentCraftFlow(input);
}

const promptTemplate = ai.definePrompt({
  name: 'demoContentCraftPrompt',
  input: { schema: ContentCraftInputSchema },
  output: { schema: ContentCraftOutputSchema },
  prompt: `You are ContentCraft AI. A user wants to generate a "{{contentType}}" based on the following prompt:
---
{{prompt}}
---
Generate a short, engaging piece of content (2-4 sentences for captions/descriptions, 1-2 paragraphs for blog posts/emails).
Return the output in the specified JSON format.
Example for a blog post prompt "benefits of AI in marketing":
{
  "generatedContent": "AI is revolutionizing marketing by enabling personalized customer experiences at scale and optimizing campaigns through data-driven insights. From chatbots providing instant support to predictive analytics forecasting trends, AI tools help businesses connect with their audience more effectively and achieve better ROI.",
  "contentTypeUsed": "blogPost"
}
`,
});

const demoContentCraftFlow = ai.defineFlow(
  {
    name: 'demoContentCraftFlow',
    inputSchema: ContentCraftInputSchema,
    outputSchema: ContentCraftOutputSchema,
  },
  async (input) => {
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

    let content = `This is a sample ${input.contentType} about "${input.prompt.substring(0, Math.min(50, input.prompt.length))}...". `;
    const randomSeed = Math.random();

    if (input.contentType === "blogPost") {
      content += `\n\nParagraph 1 for ${input.contentType}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;
      if (randomSeed > 0.5) {
        content += `\n\nParagraph 2 for ${input.contentType}: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
      }
    } else if (input.contentType === "socialMediaCaption") {
      content += `Engage your audience with this captivating ${input.contentType}! #AI #ContentCreation #${input.prompt.split(" ")[0] || "Demo"}`;
      if (randomSeed > 0.3) content += ` ✨ Check it out!`;
      if (randomSeed > 0.6) content += ` Follow us for more!`;
    } else if (input.contentType === "productDescription") {
      content += `This amazing product for "${input.prompt.substring(0, Math.min(30, input.prompt.length))}" will solve all your needs. It's innovative, stylish, and built to last. Get yours today!`;
      if (randomSeed > 0.5) content += ` Features include X, Y, and Z.`;
    } else { // emailDraft
        content += `\n\nHope this email finds you well.\n\nI'm writing to discuss ${input.prompt.substring(0, Math.min(40, input.prompt.length))}. We should explore options A and B. \n\nLet me know your thoughts.\n\nBest regards,\n[Your Name]`;
        if (randomSeed > 0.5) content = content.replace("options A and B", "the key points we talked about earlier");
    }

    return {
      generatedContent: content,
      contentTypeUsed: input.contentType,
    };
  }
);

    
