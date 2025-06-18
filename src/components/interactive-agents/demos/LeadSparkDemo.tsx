
"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, UserCheck, Sparkles, Linkedin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { handleLeadSparkAction } from "@/app/interactive-agents/actions/leadSparkActions";
import type { LeadSparkInput, LeadSparkOutput } from "@/ai/flows/interactive-demos/demoLeadSparkFlow";
import { useToast } from "@/hooks/use-toast";

interface LeadSparkDemoProps {
  agent: InteractiveAgentInfo;
}

const LeadSparkDemo: React.FC<LeadSparkDemoProps> = ({ agent }) => {
  const [leadQuery, setLeadQuery] = useState("");
  const [result, setResult] = useState<LeadSparkOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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
          toast({ variant: "destructive", title: "Error", description: response.error });
        } else if (response) {
          setResult(response);
        } else {
          setError("Received an unexpected response from the agent.");
          toast({ variant: "destructive", title: "Error", description: "Received an unexpected response." });
        }
      } catch (e: any) {
        setError(e.message || "An error occurred while qualifying the lead.");
        toast({ variant: "destructive", title: "Error", description: e.message || "An unexpected error occurred." });
      }
    });
  };

  // Extract color name for dynamic class generation, e.g., "amber" from "bg-amber-500"
  const colorName = agent.themeColorClass.replace('bg-', '').split('-')[0];
  const demoButtonClass = `bg-${colorName}-500 hover:bg-${colorName}-600`;
  const demoInputFocusClass = `focus:ring-${colorName}-500`;
  const demoCardAccentBorder = `border-${colorName}-200`;
  const demoCardAccentBg = `bg-${colorName}-50`;
  const demoCardAccentText = `text-${colorName}-700`;


  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="leadQuery" className="font-medium text-foreground/90">Enter Lead Query (e.g., Company Name, Industry, or LinkedIn Profile URL)</Label>
        <Textarea
          id="leadQuery"
          value={leadQuery}
          onChange={(e) => setLeadQuery(e.target.value)}
          placeholder="e.g., 'Tech startups in San Francisco' or 'linkedin.com/in/johndoe'"
          className={`min-h-[100px] bg-background/30 border-border ${demoInputFocusClass} mt-1`}
          disabled={isPending}
        />
        <Button variant="outline" size="sm" onClick={() => setLeadQuery("Software company specializing in AI based in New York with 50-200 employees")} className={`mt-2 border-${colorName}-500/50 text-${colorName}-600 hover:bg-${colorName}-500/10`} disabled={isPending}>
          Use Sample Query
        </Button>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className={`w-full text-white ${demoButtonClass}`}>
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

      {error && !isPending && (
        <Card className={`bg-destructive/10 ${demoCardAccentBorder}`}>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive/90">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className={`${demoCardAccentBg} ${demoCardAccentBorder}`}>
          <CardHeader>
            <CardTitle className={`${demoCardAccentText} flex items-center`}>
              <UserCheck className="mr-2 h-5 w-5" /> LeadSpark AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground/90">
            <div>
              <h4 className={`font-semibold ${demoCardAccentText}`}>Lead Name:</h4>
              <p className="text-sm bg-background/50 p-2 rounded border border-border">{result.leadName}</p>
            </div>
            <div>
              <h4 className={`font-semibold ${demoCardAccentText}`}>Company:</h4>
              <p className="text-sm bg-background/50 p-2 rounded border border-border">{result.companyName}</p>
            </div>
            <div>
              <h4 className={`font-semibold ${demoCardAccentText}`}>Lead Score: 
                <span 
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium text-white ${
                    result.leadScore > 70 ? `bg-${colorName}-600` : result.leadScore > 40 ? `bg-${colorName}-400 text-black` : `bg-${colorName}-300 text-black`
                  }`}
                >
                  {result.leadScore}/100
                </span>
              </h4>
              <p className="text-sm bg-background/50 p-2 rounded border border-border">{result.scoreReasoning}</p>
            </div>
            <div>
              <h4 className={`font-semibold ${demoCardAccentText}`}>CRM Entry Preview:</h4>
              <div className="text-sm bg-background/50 p-3 rounded border border-border space-y-1">
                <p><strong>Status:</strong> {result.crmPreview.status}</p>
                <p><strong>Contact:</strong> {result.crmPreview.contactEmail}</p>
                <p><strong>Notes:</strong> {result.crmPreview.notes}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-2">Simulated analysis. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
       {!result && !error && !isPending && (
         <div className={`text-center text-muted-foreground py-8 border-2 border-dashed ${demoCardAccentBorder} rounded-lg bg-background/20`}>
            <Linkedin size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your qualified lead insights will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default LeadSparkDemo;
