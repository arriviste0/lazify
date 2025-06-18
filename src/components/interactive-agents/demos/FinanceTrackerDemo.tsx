
"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, PieChart, DollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";
import { handleFinanceTrackerAction } from "@/app/interactive-agents/actions/financeTrackerActions";
import type { FinanceTrackerInput, FinanceTrackerOutput } from "@/ai/flows/interactive-demos/demoFinanceTrackerFlow";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from "@/hooks/use-toast";

interface FinanceTrackerDemoProps {
  agent: InteractiveAgentInfo;
}

const FinanceTrackerDemo: React.FC<FinanceTrackerDemoProps> = ({ agent }) => {
  const [expenses, setExpenses] = useState("");
  const [result, setResult] = useState<FinanceTrackerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const sampleExpenses = `
Uber ₹300
Swiggy ₹550 (Lunch)
Coffee ₹150
Netflix Subscription ₹199
Groceries ₹1200
Movie Tickets ₹600
Zomato ₹350 (Dinner)
Electricity Bill ₹800
Internet Bill ₹999
Shopping - Clothes ₹2500
  `.trim();

  const handleSubmit = async () => {
    if (!expenses.trim()) {
      setError("Please enter a list of expenses.");
      return;
    }
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await handleFinanceTrackerAction({ expensesInput: expenses });
        if (response && 'error' in response) {
          setError(response.error);
          toast({ variant: "destructive", title: "Error", description: response.error });
        } else if (response) {
          setResult(response);
        } else {
          setError("Received an unexpected response from the agent.");
          toast({ variant: "destructive", title: "Error", description: "Received an unexpected response." });
        }
      } catch (e: any) {
        setError(e.message || "An error occurred while tracking finances.");
        toast({ variant: "destructive", title: "Error", description: e.message || "An unexpected error occurred." });
      }
    });
  };

  // Extract color name for dynamic class generation, e.g., "teal" from "bg-teal-500"
  const colorName = agent.themeColorClass.replace('bg-', '').split('-')[0];
  const demoButtonClass = `bg-${colorName}-500 hover:bg-${colorName}-600`;
  const demoInputFocusClass = `focus:ring-${colorName}-500`;
  const demoCardAccentBorder = `border-${colorName}-200`;
  const demoCardAccentBg = `bg-${colorName}-50`; // For card background
  const demoCardAccentText = `text-${colorName}-700`; // For card titles etc.

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="expenses" className="font-medium text-foreground/90">Enter Your Expenses (one per line, e.g., 'Item Name ₹Amount')</Label>
        <Textarea
          id="expenses"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
          placeholder="e.g., Coffee ₹100\nLunch ₹350\nMovie Tickets ₹500"
          className={`min-h-[150px] bg-background/30 border-border ${demoInputFocusClass} mt-1`}
          disabled={isPending}
        />
        <Button variant="outline" size="sm" onClick={() => setExpenses(sampleExpenses)} className={`mt-2 border-${colorName}-500/50 text-${colorName}-600 hover:bg-${colorName}-500/10`} disabled={isPending}>
          Use Sample Expenses
        </Button>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className={`w-full text-white ${demoButtonClass}`}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Expenses...
          </>
        ) : (
          <>
            <DollarSign className="mr-2 h-4 w-4" /> Track Expenses
          </>
        )}
      </Button>

      {error && !isPending && (
        <Card className={`bg-destructive/10 ${demoCardAccentBorder}`}>
          <CardHeader><CardTitle className="text-destructive flex items-center"><AlertTriangle className="mr-2 h-5 w-5" /> Error</CardTitle></CardHeader>
          <CardContent><p className="text-destructive/90">{error}</p></CardContent>
        </Card>
      )}

      {result && (
        <Card className={`${demoCardAccentBg} ${demoCardAccentBorder}`}>
          <CardHeader>
            <CardTitle className={`${demoCardAccentText} flex items-center`}>
              <PieChart className="mr-2 h-5 w-5" /> Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <div>
              <h4 className={`font-semibold ${demoCardAccentText} mb-2`}>Category-wise Spend (Total: ₹{result.totalSpend.toFixed(2)}):</h4>
              {result.categoryBreakdown && result.categoryBreakdown.length > 0 ? (
                <div className="h-[250px] w-full bg-background/50 p-2 rounded border border-border">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={result.categoryBreakdown} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="category" fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'hsl(var(--popover))', 
                            borderRadius: '0.5rem', 
                            borderColor: `hsl(var(--${colorName}-500))` 
                        }}
                        labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                        itemStyle={{ color: `hsl(var(--${colorName}-500))` }}
                       />
                      <Legend wrapperStyle={{fontSize: '12px', color: 'hsl(var(--muted-foreground))'}}/>
                      <Bar dataKey="amount" fill={`hsl(var(--${colorName}-500))`} name="Amount (₹)" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm">No category breakdown available.</p>
              )}
            </div>
            <div>
              <h4 className={`font-semibold ${demoCardAccentText}`}>Savings Tip:</h4>
              <p className="text-sm bg-background/50 p-3 rounded border border-border italic">{result.savingsTip}</p>
            </div>
             <p className="text-xs text-muted-foreground pt-2">Simulated analysis. Chart data is illustrative. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
      {!result && !error && !isPending && (
         <div className={`text-center text-muted-foreground py-8 border-2 border-dashed ${demoCardAccentBorder} rounded-lg bg-background/20`}>
            <PieChart size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your expense breakdown will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default FinanceTrackerDemo;
