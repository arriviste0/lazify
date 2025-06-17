
"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, Inbox, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { handleInboxZeroAction } from "@/app/interactive-agents/actions/inboxZeroActions"; // Updated path
import type { InboxZeroInput, InboxZeroOutput } from "@/ai/flows/interactive-demos/demoInboxZeroFlow"; // Updated path

interface InboxZeroDemoProps {
  agent: InteractiveAgentInfo;
}

const sampleEmail = `Subject: Project Phoenix Update & Urgent Review Needed

Hi Team,

Just a quick update on Project Phoenix. The latest build (v2.3.1) is now deployed to staging. 
Client feedback on the new dashboard has been overwhelmingly positive!

However, I've noticed a few critical bugs in the reporting module that need immediate attention. 
Specifically, the P&L statement isn't calculating regional taxes correctly. This needs to be fixed before the EOD deadline.
@Mark - can you take a look?

Also, @Sarah, could you please send over the finalized marketing copy for the newsletter?
We need to get it to the design team by tomorrow morning at the latest.

Best,
Alex
VP of Product`;

const InboxZeroDemo: React.FC<InboxZeroDemoProps> = ({ agent }) => {
  const [emailContent, setEmailContent] = useState("");
  const [result, setResult] = useState<InboxZeroOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    if (!emailContent.trim()) {
      setError("Please paste some email content.");
      return;
    }
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await handleInboxZeroAction({ emailContent });
        if (response && 'error' in response) {
          setError(response.error);
        } else if (response) {
          setResult(response);
        } else {
          setError("Received an unexpected response from the agent.");
        }
      } catch (e: any) {
        setError(e.message || "An error occurred while processing the email.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="emailContent" className="text-neutral-700 font-medium">Paste Email Content (or use sample)</Label>
        <Textarea
          id="emailContent"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder="Paste one or more emails here..."
          className="min-h-[180px] bg-white border-amber-300 focus:ring-primary mt-1"
          disabled={isPending}
        />
        <Button variant="outline" size="sm" onClick={() => setEmailContent(sampleEmail)} className="mt-2 border-primary text-primary hover:bg-primary/10" disabled={isPending}>
          Use Sample Email
        </Button>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Process Emails
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
              <Inbox className="mr-2 h-5 w-5" /> InboxZero AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-neutral-700">
            <div>
              <h4 className="font-semibold text-neutral-800">Summary:</h4>
              <p className="text-sm bg-white p-2 rounded border border-amber-100">{result.summary}</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-800">Suggested Category:</h4>
              <p className="text-sm bg-white p-2 rounded border border-amber-100">{result.category}</p>
            </div>
             {result.actionItems && result.actionItems.length > 0 && (
              <div>
                <h4 className="font-semibold text-neutral-800">Action Items:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm bg-white p-3 rounded border border-amber-100">
                  {result.actionItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-neutral-500 pt-2">Simulated processing. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
       {!result && !error && !isPending && (
         <div className="text-center text-neutral-500 py-8 border-2 border-dashed border-amber-200 rounded-lg">
            <Inbox size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your processed email insights will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default InboxZeroDemo;
