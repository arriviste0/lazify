
"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, TrendingUp, PieChart, DollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";
import { handleFinanceTrackerAction } from "@/app/interactive-agents/actions/financeTrackerActions";
import type { FinanceTrackerInput, FinanceTrackerOutput } from "@/ai/flows/interactive-demos/demoFinanceTrackerFlow";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface FinanceTrackerDemoProps {
  agent: InteractiveAgentInfo;
}

const FinanceTrackerDemo: React.FC<FinanceTrackerDemoProps> = ({ agent }) => {
  const [expenses, setExpenses] = useState("");
  const [result, setResult] = useState<FinanceTrackerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
        } else if (response) {
          setResult(response);
        } else {
          setError("Received an unexpected response from the agent.");
        }
      } catch (e: any) {
        setError(e.message || "An error occurred while tracking finances.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="expenses" className="text-neutral-700 font-medium">Enter Your Expenses (one per line, e.g., 'Item Name ₹Amount')</Label>
        <Textarea
          id="expenses"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
          placeholder="e.g., Coffee ₹100&#10;Lunch ₹350&#10;Movie Tickets ₹500"
          className="min-h-[150px] bg-white border-amber-300 focus:ring-primary mt-1"
          disabled={isPending}
        />
        <Button variant="outline" size="sm" onClick={() => setExpenses(sampleExpenses)} className="mt-2 border-primary text-primary hover:bg-primary/10" disabled={isPending}>
          Use Sample Expenses
        </Button>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
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

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader><CardTitle className="text-red-700 flex items-center"><AlertTriangle className="mr-2 h-5 w-5" /> Error</CardTitle></CardHeader>
          <CardContent><p className="text-red-600">{error}</p></CardContent>
        </Card>
      )}

      {result && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center">
              <PieChart className="mr-2 h-5 w-5" /> Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-neutral-700">
            <div>
              <h4 className="font-semibold text-neutral-800 mb-2">Category-wise Spend:</h4>
              {result.categoryBreakdown && result.categoryBreakdown.length > 0 ? (
                <div className="h-[250px] w-full bg-white p-2 rounded border border-amber-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.categoryBreakdown} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,200,200,0.5)" />
                      <XAxis dataKey="category" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '0.5rem', borderColor: '#FDE68A' }}/>
                      <Legend wrapperStyle={{fontSize: '12px'}}/>
                      <Bar dataKey="amount" fill="#8884d8" name="Amount (₹)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm">No category breakdown available.</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-neutral-800">Savings Tip:</h4>
              <p className="text-sm bg-white p-3 rounded border border-amber-100 italic">{result.savingsTip}</p>
            </div>
             <p className="text-xs text-neutral-500 pt-2">Simulated analysis. Chart data is illustrative. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
      {!result && !error && !isPending && (
         <div className="text-center text-neutral-500 py-8 border-2 border-dashed border-amber-200 rounded-lg">
            <PieChart size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your expense breakdown will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default FinanceTrackerDemo;
