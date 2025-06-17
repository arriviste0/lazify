
'use server';
/**
 * @fileOverview Simulates FinanceTracker AI for interactive demos.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const FinanceTrackerInputSchema = z.object({
  expensesInput: z.string().min(5).describe("A string containing expenses, ideally one per line with item and amount, e.g., 'Coffee ₹100'."),
});
export type FinanceTrackerInput = z.infer<typeof FinanceTrackerInputSchema>;

const CategorySpendSchema = z.object({
  category: z.string(),
  amount: z.number(),
});

const FinanceTrackerOutputSchema = z.object({
  categoryBreakdown: z.array(CategorySpendSchema).describe('List of categories with total spend in each.'),
  totalSpend: z.number().describe('Total amount spent.'),
  savingsTip: z.string().describe('A personalized savings tip based on the expenses.'),
});
export type FinanceTrackerOutput = z.infer<typeof FinanceTrackerOutputSchema>;

export async function demoFinanceTracker(input: FinanceTrackerInput): Promise<FinanceTrackerOutput> {
  return demoFinanceTrackerFlow(input);
}

const promptTemplate = ai.definePrompt({
  name: 'demoFinanceTrackerPrompt',
  input: { schema: FinanceTrackerInputSchema },
  output: { schema: FinanceTrackerOutputSchema },
  prompt: `You are FinanceTracker AI. A user has provided the following list of expenses:
---
{{expensesInput}}
---
Analyze these expenses.
1. Parse each line to identify the item and amount (assume INR if no currency symbol, look for '₹', '$', 'USD', 'INR').
2. Categorize each expense into one of: "Food & Drinks", "Bills & Utilities", "Transportation", "Shopping", "Entertainment", "Miscellaneous".
3. Calculate the total spend for each category.
4. Calculate the overall total spend.
5. Provide one practical savings tip based on the spending pattern.

Return the output in the specified JSON format.
Example Input: "Uber ₹300\\nSwiggy ₹500 (Lunch)\\nCoffee ₹150"
Example Output:
{
  "categoryBreakdown": [
    { "category": "Transportation", "amount": 300 },
    { "category": "Food & Drinks", "amount": 650 }
  ],
  "totalSpend": 950,
  "savingsTip": "Consider preparing lunch at home a few times a week to save on food expenses."
}
`,
});

const demoFinanceTrackerFlow = ai.defineFlow(
  {
    name: 'demoFinanceTrackerFlow',
    inputSchema: FinanceTrackerInputSchema,
    outputSchema: FinanceTrackerOutputSchema,
  },
  async (input) => {
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

    const expenseLines = input.expensesInput.split('\n').map(e => e.trim()).filter(e => e.length > 0);
    const categories: Record<string, number> = {
      "Food & Drinks": 0,
      "Bills & Utilities": 0,
      "Transportation": 0,
      "Shopping": 0,
      "Entertainment": 0,
      "Miscellaneous": 0,
    };
    let totalSpend = 0;

    expenseLines.forEach(line => {
      // Enhanced regex to find amounts with or without currency symbols, and common currency codes
      const amountMatch = line.match(/(?:₹|\$|€|£|USD|INR|EUR|GBP)?\s*(\d[\d,.]*\d|\d)/);
      const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;
      totalSpend += amount;

      const lineLower = line.toLowerCase();

      if (lineLower.match(/coffee|tea|swiggy|zomato|lunch|dinner|food|restaurant|cafe|grocer(y|ies)|snacks|juice/i)) categories["Food & Drinks"] += amount;
      else if (lineLower.match(/bill|netflix|spotify|subscription|electricity|internet|rent|phone|utility|gas|water/i)) categories["Bills & Utilities"] += amount;
      else if (lineLower.match(/uber|ola|taxi|bus|metro|fuel|flight|train|auto|parking|transport/i)) categories["Transportation"] += amount;
      else if (lineLower.match(/shop|clothes|amazon|flipkart|purchase|store|gift|apparel|gadget|book/i)) categories["Shopping"] += amount;
      else if (lineLower.match(/movie|tickets|concert|game|event|entertainment|party|hobby/i)) categories["Entertainment"] += amount;
      else categories["Miscellaneous"] += amount;
    });
    
    const categoryBreakdown = Object.entries(categories)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({ category, amount: parseFloat(amount.toFixed(2)) }));

    let savingsTip = "Track your spending consistently to identify patterns. Small changes can lead to big savings over time!";
    if (totalSpend === 0 && expenseLines.length > 0) {
        savingsTip = "It seems I couldn't parse amounts from your entries. Please ensure they are like 'Item Name ₹100' or 'Item Name 100'.";
    } else if (categories["Food & Drinks"] > totalSpend * 0.45) {
      savingsTip = "Your food & drinks expenses are a significant portion of your spending. Consider setting a weekly budget for eating out or exploring meal prepping.";
    } else if (categories["Shopping"] > totalSpend * 0.35) {
      savingsTip = "Shopping seems to be a key spending area. Try the '30-day rule' for non-essential purchases: if you still want it after 30 days, then consider buying it.";
    } else if (categories["Entertainment"] > totalSpend * 0.25) {
      savingsTip = "Entertainment spending is noticeable. Look for free local events or subscription bundles to save.";
    } else if (categories["Bills & Utilities"] > totalSpend * 0.5) {
        savingsTip = "Bills and utilities make up a large part of your expenses. Review subscriptions and look for energy-saving opportunities.";
    } else if (totalSpend > 0 && categoryBreakdown.length > 0) {
        const highestCat = categoryBreakdown.sort((a,b) => b.amount - a.amount)[0];
        if (highestCat) {
            savingsTip = `Your highest spending category is "${highestCat.category}". Focusing on small reductions here could make a big impact!`;
        }
    }


    return {
      categoryBreakdown,
      totalSpend: parseFloat(totalSpend.toFixed(2)),
      savingsTip,
    };
  }
);

    