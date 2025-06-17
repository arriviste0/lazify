
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
    { "id": "rs001", "name": "SpeedStride X1 Runners", "price": 4999, "imageUrl": "https://placehold.co/300x200.png?text=SpeedStride+X1", "dataAiHint": "running shoe" },
    { "id": "rs002", "name": "TrailBlaze Pro All-Terrain", "price": 6499, "imageUrl": "https://placehold.co/300x200.png?text=TrailBlaze+Pro", "dataAiHint": "trail shoe" }
  ],
  "qnaResponse": "Q: What's the best type of running shoe for beginners? A: Look for good cushioning and a neutral support shoe if you're just starting out!"
}
`,
});

const allProducts = [
    { id: "shoe1", name: "UrbanStride Daily Walker", price: 3499, hint: "modern sneaker side view", tags: ["shoe", "casual", "unisex", "adult", "youngAdult"] },
    { id: "shoe2", name: "FlexRun Performance Trainer", price: 5299, hint: "sporty running shoe colorful", tags: ["shoe", "sport", "running", "unisex", "youngAdult", "adult"] },
    { id: "shoe3", name: "Classic Comfort Loafer", price: 2999, hint: "leather loafer casual", tags: ["shoe", "formal", "casual", "male", "adult", "senior"] },
    { id: "shoe4", name: "SparkleStep Kids Sneakers", price: 1899, hint: "kids sneaker bright colors", tags: ["shoe", "kids", "teen", "unisex"] },
    { id: "dress1", name: "Floral Summer Midi Dress", price: 2899, hint: "summer dress floral pattern", tags: ["dress", "summer", "female", "youngAdult", "adult"] },
    { id: "dress2", name: "Elegant Evening Gown", price: 7999, hint: "elegant gown silk", tags: ["dress", "evening", "formal", "female", "adult"] },
    { id: "dress3", name: "Casual Knit Maxi Dress", price: 3200, hint: "knit dress comfortable", tags: ["dress", "casual", "female", "youngAdult", "adult"] },
    { id: "dress4", name: "Teen Party Sequins Dress", price: 2500, hint: "teen dress party sequins", tags: ["dress", "party", "female", "teen"] },
    { id: "lap1", name: "UltraBook Pro X15", price: 89990, hint: "sleek laptop silver", tags: ["laptop", "professional", "unisex", "adult", "youngAdult"] },
    { id: "lap2", name: "DevWorkstation Z9", price: 125000, hint: "powerful laptop workstation", tags: ["laptop", "developer", "unisex", "adult"] },
    { id: "lap3", name: "TravelLite Compact 13", price: 65000, hint: "compact laptop lightweight", tags: ["laptop", "travel", "unisex", "youngAdult", "adult"] },
    { id: "lap4", name: "Gamer Rig Titan X", price: 150000, hint: "gaming laptop RGB lights", tags: ["laptop", "gaming", "unisex", "teen", "youngAdult"] },
    { id: "gen1", name: "Versatile Smart Gadget", price: 1999, hint: "modern tech gadget", tags: ["gadget", "smart", "unisex", "any"] },
    { id: "gen2", name: "Premium Lifestyle Accessory", price: 3499, hint: "stylish accessory", tags: ["accessory", "lifestyle", "unisex", "any"] },
    { id: "book1", name: "Mystery of the Old Manor", price: 499, hint: "mystery book cover", tags: ["book", "mystery", "any", "teen", "adult"] },
    { id: "book2", name: "Sci-Fi Adventures in Space", price: 650, hint: "sci-fi book spaceship", tags: ["book", "sci-fi", "any", "youngAdult", "adult"] },
];


const demoShopSmartFlow = ai.defineFlow(
  {
    name: 'demoShopSmartFlow',
    inputSchema: ShopSmartInputSchema,
    outputSchema: ShopSmartOutputSchema,
  },
  async (input) => {
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

    const interestLower = input.productInterest.toLowerCase();
    let filteredProducts = allProducts.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(interestLower);
        const tagMatch = p.tags.some(tag => interestLower.includes(tag) || tag.includes(interestLower));
        const genderMatch = input.gender === "any" || p.tags.includes(input.gender || "any");
        const ageMatch = input.ageGroup === "any" || p.tags.includes(input.ageGroup || "any");
        return (nameMatch || tagMatch) && genderMatch && ageMatch;
    });

    if (filteredProducts.length === 0) { // Fallback if no specific matches
        filteredProducts = allProducts.filter(p => {
            const genderMatch = input.gender === "any" || p.tags.includes(input.gender || "any");
            const ageMatch = input.ageGroup === "any" || p.tags.includes(input.ageGroup || "any");
            return genderMatch && ageMatch;
        });
    }
     if (filteredProducts.length === 0) { // Wider fallback
        filteredProducts = allProducts.filter(p => p.tags.includes("any"));
    }


    // Shuffle and pick 2 or 3
    const recommendations = filteredProducts.sort(() => 0.5 - Math.random()).slice(0, Math.random() > 0.4 ? 3 : 2);
    const finalRecs = recommendations.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: `https://placehold.co/300x200.png?text=${encodeURIComponent(p.name.split(" ").slice(0,2).join("+"))}`,
        dataAiHint: p.hint,
    }));
    
    let qnaResponse = `Q: What should I look for when buying ${input.productInterest}? A: Always check reviews for ${input.productInterest}, compare features against your needs, and ensure it fits your budget! Consider warranty options too.`;
    if (interestLower.includes("shoe")) {
        qnaResponse = "Q: How do I find the right shoe size online? A: Check the brand's sizing chart and measure your foot. Reading customer reviews about fit can also be very helpful!";
    } else if (interestLower.includes("laptop")) {
        qnaResponse = "Q: What's more important for a laptop, RAM or Processor? A: It depends on your use! For multitasking and heavy apps, more RAM is crucial. For speed and processing power, a better CPU matters. Balance both for general use.";
    } else if (interestLower.includes("dress")) {
        qnaResponse = "Q: How can I choose a dress that flatters my body type? A: A-line dresses are versatile for many shapes. Empire waists can be great for pear shapes, while wrap dresses often suit hourglass figures. Experiment to see what you feel best in!";
    }


    return {
      recommendations: finalRecs,
      qnaResponse,
    };
  }
);

    