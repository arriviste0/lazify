
'use server';
/**
 * @fileOverview Simulates ShopSmart AI for interactive demos.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const ShopSmartInputSchema = z.object({
  productInterest: z.string().min(3).describe("User's product interest or query, e.g., 'running shoes'."),
  ageGroup: z.enum(["any", "teen", "youngAdult", "adult", "senior"]).optional().default("any").describe("Target age group."),
  gender: z.enum(["any", "male", "female", "unisex"]).optional().default("any").describe("Target gender."),
});
export type ShopSmartInput = z.infer<typeof ShopSmartInputSchema>;

const ProductRecommendationSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  imageUrl: z.string().url().optional().describe("Placeholder image URL for the product"),
  dataAiHint: z.string().optional().describe("Hint for AI image generation"),
});
export type ProductRecommendation = z.infer<typeof ProductRecommendationSchema>;

const ShopSmartOutputSchema = z.object({
  recommendations: z.array(ProductRecommendationSchema).describe('List of 2-3 product recommendations.'),
  qnaResponse: z.string().optional().describe("A helpful tip or answer to a common question related to the product interest."),
});
export type ShopSmartOutput = z.infer<typeof ShopSmartOutputSchema>;

export async function demoShopSmart(input: ShopSmartInput): Promise<ShopSmartOutput> {
  return demoShopSmartFlow(input);
}

const promptTemplate = ai.definePrompt({
  name: 'demoShopSmartPrompt',
  input: { schema: ShopSmartInputSchema },
  output: { schema: ShopSmartOutputSchema },
  prompt: `You are ShopSmart AI, an e-commerce assistant.
User Input:
- Product Interest: {{productInterest}}
- Age Group: {{ageGroup}}
- Gender: {{gender}}

Generate 2-3 diverse product recommendations based on the interest. Include a plausible name, price (INR), and a placeholder image URL (use https://placehold.co/300x200.png?text=PRODUCT+NAME).
Also, provide a short, helpful Q&A style tip or common question answer related to the product interest.

Example for "running shoes", age "youngAdult", gender "male":
{
  "recommendations": [
    { "id": "rs001", "name": "SpeedStride X1 Runners", "price": 4999, "imageUrl": "https://placehold.co/300x200.png?text=SpeedStride+X1" },
    { "id": "rs002", "name": "TrailBlaze Pro All-Terrain", "price": 6499, "imageUrl": "https://placehold.co/300x200.png?text=TrailBlaze+Pro" }
  ],
  "qnaResponse": "Q: What's the best type of running shoe for beginners? A: Look for good cushioning and a neutral support shoe if you're just starting out!"
}
`,
});

const demoShopSmartFlow = ai.defineFlow(
  {
    name: 'demoShopSmartFlow',
    inputSchema: ShopSmartInputSchema,
    outputSchema: ShopSmartOutputSchema,
  },
  async (input) => {
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

    const recommendations: ProductRecommendation[] = [];
    const interest = input.productInterest.toLowerCase();

    if (interest.includes("shoe") || interest.includes("runner") || interest.includes("sneaker")) {
      recommendations.push(
        { id: "shoe1", name: "UrbanStride Daily Walker", price: 3499, imageUrl: `https://placehold.co/300x200.png?text=UrbanStride`, dataAiHint: "modern sneaker side view" },
        { id: "shoe2", name: "FlexRun Performance Trainer", price: 5299, imageUrl: `https://placehold.co/300x200.png?text=FlexRun`, dataAiHint: "sporty running shoe colorful" },
        { id: "shoe3", name: "Classic Comfort Loafer", price: 2999, imageUrl: `https://placehold.co/300x200.png?text=Comfort+Loafer`, dataAiHint: "leather loafer casual" }
      );
    } else if (interest.includes("dress") || interest.includes("gown")) {
      recommendations.push(
        { id: "dress1", name: "Floral Summer Midi Dress", price: 2899, imageUrl: `https://placehold.co/300x200.png?text=Floral+Midi`, dataAiHint: "summer dress floral pattern" },
        { id: "dress2", name: "Elegant Evening Gown", price: 7999, imageUrl: `https://placehold.co/300x200.png?text=Evening+Gown`, dataAiHint: "elegant gown silk" },
        { id: "dress3", name: "Casual Knit Maxi Dress", price: 3200, imageUrl: `https://placehold.co/300x200.png?text=Knit+Maxi`, dataAiHint: "knit dress comfortable" }
      );
    } else if (interest.includes("laptop") || interest.includes("notebook") || interest.includes("computer")) {
      recommendations.push(
        { id: "lap1", name: "UltraBook Pro X15", price: 89990, imageUrl: `https://placehold.co/300x200.png?text=UltraBook+Pro`, dataAiHint: "sleek laptop silver" },
        { id: "lap2", name: "DevWorkstation Z9", price: 125000, imageUrl: `https://placehold.co/300x200.png?text=DevWorkstation`, dataAiHint: "powerful laptop workstation" },
        { id: "lap3", name: "TravelLite Compact 13", price: 65000, imageUrl: `https://placehold.co/300x200.png?text=TravelLite+13`, dataAiHint: "compact laptop lightweight" }
      );
    } else {
         recommendations.push(
            { id: "gen1", name: "Versatile Smart Gadget", price: 1999, imageUrl: `https://placehold.co/300x200.png?text=Smart+Gadget`, dataAiHint: "modern tech gadget" },
            { id: "gen2", name: "Premium Lifestyle Accessory", price: 3499, imageUrl: `https://placehold.co/300x200.png?text=Lifestyle+Accessory`, dataAiHint: "stylish accessory" }
         );
    }
    
    // Filter recommendations based on gender if applicable (very basic)
    if (input.gender === "male") {
        // Placeholder: In a real scenario, filter by male-specific products or tags
    } else if (input.gender === "female") {
        // Placeholder: Filter by female-specific products
    }

    const qnaResponse = `Q: What should I consider when buying ${input.productInterest}? A: Always check reviews, compare features, and ensure it fits your specific needs and budget!`;

    return {
      recommendations: recommendations.slice(0, Math.random() > 0.5 ? 2:3), // Show 2 or 3
      qnaResponse,
    };
  }
);
