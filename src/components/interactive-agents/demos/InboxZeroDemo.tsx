"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, Inbox, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
// import { handleInboxZeroAction } from "@/app/interactive-agents/actions/inboxZeroActions";
import type { InboxZeroInput, InboxZeroOutput } from "@/ai/flows/interactive-demos/demoInboxZeroFlow";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!emailContent.trim()) {
      setError("Please paste some email content.");
      return;
    }
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await fetch('/api/interactive-agents/inbox-zero', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'processEmail',
            data: { emailContent },
          }),
        });

        const responseData = await response.json();

        if (!response.ok || !responseData.success) {
          const errorMessage = responseData.message || "An error occurred while processing the email.";
          setError(errorMessage);
          toast({ variant: "destructive", title: "Error", description: errorMessage });
        } else {
          setResult(responseData.email);
        }
      } catch (e: any) {
        setError(e.message || "An error occurred while processing the email.");
        toast({ variant: "destructive", title: "Error", description: e.message || "An unexpected error occurred." });
      }
    });
  };
  
  // Extract color name for dynamic class generation, e.g., "blue" from "bg-blue-500"
  const colorName = agent.themeColorClass.replace('bg-', '').split('-')[0];
  const demoButtonClass = `bg-${colorName}-500 hover:bg-${colorName}-600`;
  const demoInputFocusClass = `focus:ring-${colorName}-500`;
  const demoCardAccentBorder = `border-${colorName}-200`;
  const demoCardAccentBg = `bg-${colorName}-50`;
  const demoCardAccentText = `text-${colorName}-700`;


  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="emailContent" className="font-medium text-foreground/90">Paste Email Content (or use sample)</Label>
        <Textarea
          id="emailContent"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder="Paste one or more emails here..."
          className={`min-h-[180px] bg-background/30 border-border ${demoInputFocusClass} mt-1`}
          disabled={isPending}
        />
        <Button variant="outline" size="sm" onClick={() => setEmailContent(sampleEmail)} className={`mt-2 border-${colorName}-500/50 text-${colorName}-600 hover:bg-${colorName}-500/10`} disabled={isPending}>
          Use Sample Email
        </Button>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className={`w-full text-white ${demoButtonClass}`}>
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
              <Inbox className="mr-2 h-5 w-5" /> InboxZero AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground/90">
            <div>
              <h4 className={`font-semibold ${demoCardAccentText}`}>Summary:</h4>
              <p className="text-sm bg-background/50 p-2 rounded border border-border">{result.summary}</p>
            </div>
            <div>
              <h4 className={`font-semibold ${demoCardAccentText}`}>Suggested Category:</h4>
              <p className="text-sm bg-background/50 p-2 rounded border border-border">{result.category}</p>
            </div>
             {result.actionItems && result.actionItems.length > 0 && (
              <div>
                <h4 className={`font-semibold ${demoCardAccentText}`}>Action Items:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm bg-background/50 p-3 rounded border border-border">
                  {result.actionItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-muted-foreground pt-2">Simulated processing. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
       {!result && !error && !isPending && (
         <div className={`text-center text-muted-foreground py-8 border-2 border-dashed ${demoCardAccentBorder} rounded-lg bg-background/20`}>
            <Inbox size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your processed email insights will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default InboxZeroDemo;
