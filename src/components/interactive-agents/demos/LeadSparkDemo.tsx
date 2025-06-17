
"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, UserCheck, Sparkles, Linkedin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { handleLeadSparkAction } from "@/app/interactive-agents/actions/leadSparkActions"; // Updated path
import type { LeadSparkInput, LeadSparkOutput } from "@/ai/flows/interactive-demos/demoLeadSparkFlow"; // Updated path

interface LeadSparkDemoProps {
  agent: InteractiveAgentInfo;
}

const LeadSparkDemo: React.FC<LeadSparkDemoProps> = ({ agent }) => {
  const [leadQuery, setLeadQuery] = useState("");
  const [result, setResult] = useState<LeadSparkOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    if (!leadQuery.trim()) {
      setError("Please enter a lead query or LinkedIn URL.");
      return;
    }
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await handleLeadSparkAction({ leadQuery });
         if (response && 'error' in response) {
          setError(response.error);
        } else if (response) {
          setResult(response);
        } else {
          setError("Received an unexpected response from the agent.");
        }
      } catch (e: any) {
        setError(e.message || "An error occurred while qualifying the lead.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="leadQuery" className="text-neutral-700 font-medium">Enter Lead Query (e.g., Company Name, Industry, or LinkedIn Profile URL)</Label>
        <Textarea
          id="leadQuery"
          value={leadQuery}
          onChange={(e) => setLeadQuery(e.target.value)}
          placeholder="e.g., 'Tech startups in San Francisco' or 'linkedin.com/in/johndoe'"
          className="min-h-[100px] bg-white border-amber-300 focus:ring-primary mt-1"
          disabled={isPending}
        />
        <Button variant="outline" size="sm" onClick={() => setLeadQuery("Software company specializing in AI based in New York with 50-200 employees")} className="mt-2 border-primary text-primary hover:bg-primary/10" disabled={isPending}>
          Use Sample Query
        </Button>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Lead...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" /> Qualify Lead
          </>
        )}
      </Button>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center">
              <UserCheck className="mr-2 h-5 w-5" /> LeadSpark AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-neutral-700">
            <div>
              <h4 className="font-semibold text-neutral-800">Lead Name:</h4>
              <p className="text-sm bg-white p-2 rounded border border-amber-100">{result.leadName}</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-800">Company:</h4>
              <p className="text-sm bg-white p-2 rounded border border-amber-100">{result.companyName}</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-800">Lead Score: 
                <span 
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium text-white ${
                    result.leadScore > 70 ? 'bg-green-600' : result.leadScore > 40 ? 'bg-yellow-500 text-black' : 'bg-red-500'
                  }`}
                >
                  {result.leadScore}/100
                </span>
              </h4>
              <p className="text-sm bg-white p-2 rounded border border-amber-100">{result.scoreReasoning}</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-800">CRM Entry Preview:</h4>
              <div className="text-sm bg-white p-3 rounded border border-amber-100 space-y-1">
                <p><strong>Status:</strong> {result.crmPreview.status}</p>
                <p><strong>Contact:</strong> {result.crmPreview.contactEmail}</p>
                <p><strong>Notes:</strong> {result.crmPreview.notes}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-500 pt-2">Simulated analysis. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
       {!result && !error && !isPending && (
         <div className="text-center text-neutral-500 py-8 border-2 border-dashed border-amber-200 rounded-lg">
            <Linkedin size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your qualified lead insights will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default LeadSparkDemo;
