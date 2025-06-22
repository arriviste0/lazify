"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, CalendarCheck2 } from "lucide-react";
import { Label } from "@/components/ui/label";
// import { handleScheduleSyncAction } from "@/app/interactive-agents/actions/scheduleSyncActions";
import type { ScheduleSyncInput, ScheduleSyncOutput } from "@/ai/flows/interactive-demos/demoScheduleSyncFlow";
import { useToast } from "@/hooks/use-toast";

interface ScheduleSyncDemoProps {
  agent: InteractiveAgentInfo;
}

const ScheduleSyncDemo: React.FC<ScheduleSyncDemoProps> = ({ agent }) => {
  const [preferredDays, setPreferredDays] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [attendeeEmails, setAttendeeEmails] = useState("");
  const [meetingTopic, setMeetingTopic] = useState("");

  const [result, setResult] = useState<ScheduleSyncOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!preferredDays.trim() || !attendeeEmails.trim() || !meetingTopic.trim()) {
      setError("Please fill in preferred days, attendee emails, and meeting topic.");
      return;
    }
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await fetch('/api/interactive-agents/schedule-sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'findSlot',
            data: { preferredDays, preferredTime, attendeeEmails, meetingTopic },
          }),
        });

        const responseData = await response.json();

        if (!response.ok || !responseData.success) {
          const errorMessage = responseData.message || "An error occurred while scheduling.";
          setError(errorMessage);
          toast({ variant: "destructive", title: "Error", description: errorMessage });
        } else {
          setResult({
            suggestedSlot: responseData.slots[0] ? `${responseData.slots[0].date} at ${responseData.slots[0].time}` : 'No slots available',
            confirmationMessage: `A meeting invite for "${meetingTopic}" will be sent to attendees.`
          });
        }
      } catch (e: any) {
        setError(e.message || "An error occurred while scheduling.");
        toast({ variant: "destructive", title: "Error", description: e.message || "An unexpected error occurred." });
      }
    });
  };

  // Extract color name for dynamic class generation, e.g., "purple" from "bg-purple-500"
  const colorName = agent.themeColorClass.replace('bg-', '').split('-')[0];
  const demoButtonClass = `bg-${colorName}-500 hover:bg-${colorName}-600`;
  const demoInputFocusClass = `focus:ring-${colorName}-500`;
  const demoCardAccentBorder = `border-${colorName}-200`;
  const demoCardAccentBg = `bg-${colorName}-50`;
  const demoCardAccentText = `text-${colorName}-700`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="preferredDays" className="font-medium text-foreground/90">Preferred Days</Label>
          <Input
            id="preferredDays"
            value={preferredDays}
            onChange={(e) => setPreferredDays(e.target.value)}
            placeholder="e.g., Next Mon, Tue"
            className={`bg-background/30 border-border ${demoInputFocusClass} mt-1`}
            disabled={isPending}
          />
        </div>
        <div>
          <Label htmlFor="preferredTime" className="font-medium text-foreground/90">Preferred Time (Optional)</Label>
          <Input
            id="preferredTime"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            placeholder="e.g., Afternoon, 2-4 PM"
            className={`bg-background/30 border-border ${demoInputFocusClass} mt-1`}
            disabled={isPending}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="attendeeEmails" className="font-medium text-foreground/90">Attendee Emails (comma-separated)</Label>
        <Input
          id="attendeeEmails"
          value={attendeeEmails}
          onChange={(e) => setAttendeeEmails(e.target.value)}
          placeholder="e.g., friend@example.com, colleague@example.com"
          className={`bg-background/30 border-border ${demoInputFocusClass} mt-1`}
          disabled={isPending}
        />
      </div>
      <div>
        <Label htmlFor="meetingTopic" className="font-medium text-foreground/90">Meeting Topic</Label>
        <Input
          id="meetingTopic"
          value={meetingTopic}
          onChange={(e) => setMeetingTopic(e.target.value)}
          placeholder="e.g., Project Alpha Review"
          className={`bg-background/30 border-border ${demoInputFocusClass} mt-1`}
          disabled={isPending}
        />
      </div>


      <Button onClick={handleSubmit} disabled={isPending} className={`w-full text-white ${demoButtonClass}`}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding Slot...
          </>
        ) : (
          <>
            <CalendarCheck2 className="mr-2 h-4 w-4" /> Find Available Slot
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
              <CalendarCheck2 className="mr-2 h-5 w-5" /> Scheduling Suggestion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground/90">
            <div>
              <h4 className={`font-semibold ${demoCardAccentText}`}>Suggested Slot:</h4>
              <p className="text-sm bg-background/50 p-2 rounded border border-border">{result.suggestedSlot}</p>
            </div>
            <div>
              <h4 className={`font-semibold ${demoCardAccentText}`}>Confirmation Preview:</h4>
              <p className="text-sm bg-background/50 p-2 rounded border border-border italic">{result.confirmationMessage}</p>
            </div>
            <p className="text-xs text-muted-foreground pt-2">Simulated scheduling. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
      {!result && !error && !isPending && (
         <div className={`text-center text-muted-foreground py-8 border-2 border-dashed ${demoCardAccentBorder} rounded-lg bg-background/20`}>
            <CalendarCheck2 size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your scheduling suggestion will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default ScheduleSyncDemo;
