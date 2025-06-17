
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
      const match = line.match(/(?:₹|\$|USD|INR)?\s*(\d+(\.\d+)?)/);
      const amount = match ? parseFloat(match[1]) : 0;
      totalSpend += amount;

      if (line.match(/coffee|swiggy|zomato|lunch|dinner|food|restaurant|cafe/i)) categories["Food & Drinks"] += amount;
      else if (line.match(/bill|netflix|subscription|electricity|internet|rent/i)) categories["Bills & Utilities"] += amount;
      else if (line.match(/uber|ola|taxi|bus|metro|fuel|flight/i)) categories["Transportation"] += amount;
      else if (line.match(/shop|clothes|amazon|flipkart|purchase|store/i)) categories["Shopping"] += amount;
      else if (line.match(/movie|tickets|concert|game|event/i)) categories["Entertainment"] += amount;
      else categories["Miscellaneous"] += amount;
    });
    
    const categoryBreakdown = Object.entries(categories)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({ category, amount }));

    let savingsTip = "Track your spending for a week to identify areas where you can cut back. Even small changes add up!";
    if (categories["Food & Drinks"] > totalSpend * 0.4) {
      savingsTip = "Your food expenses are a significant portion of your spending. Consider cooking more meals at home or looking for meal deals.";
    } else if (categories["Shopping"] > totalSpend * 0.3) {
      savingsTip = "Looks like there's some active shopping! Try the 30-day rule for non-essential purchases: if you still want it after 30 days, then consider buying it.";
    }

    return {
      categoryBreakdown,
      totalSpend,
      savingsTip,
    };
  }
);
