
"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, CalendarCheck2, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { handleScheduleSyncAction } from "@/app/interactive-agents/actions/scheduleSyncActions";
import type { ScheduleSyncInput, ScheduleSyncOutput } from "@/ai/flows/interactive-demos/demoScheduleSyncFlow";

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

  const handleSubmit = async () => {
    if (!preferredDays.trim() || !attendeeEmails.trim() || !meetingTopic.trim()) {
      setError("Please fill in preferred days, attendee emails, and meeting topic.");
      return;
    }
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await handleScheduleSyncAction({ preferredDays, preferredTime, attendeeEmails, meetingTopic });
        if (response && 'error' in response) {
          setError(response.error);
        } else if (response) {
          setResult(response);
        } else {
          setError("Received an unexpected response from the agent.");
        }
      } catch (e: any) {
        setError(e.message || "An error occurred while scheduling.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="preferredDays" className="text-neutral-700 font-medium">Preferred Days</Label>
          <Input
            id="preferredDays"
            value={preferredDays}
            onChange={(e) => setPreferredDays(e.target.value)}
            placeholder="e.g., Next Mon, Tue"
            className="bg-white border-amber-300 focus:ring-primary mt-1"
            disabled={isPending}
          />
        </div>
        <div>
          <Label htmlFor="preferredTime" className="text-neutral-700 font-medium">Preferred Time (Optional)</Label>
          <Input
            id="preferredTime"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            placeholder="e.g., Afternoon, 2-4 PM"
            className="bg-white border-amber-300 focus:ring-primary mt-1"
            disabled={isPending}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="attendeeEmails" className="text-neutral-700 font-medium">Attendee Emails (comma-separated)</Label>
        <Input
          id="attendeeEmails"
          value={attendeeEmails}
          onChange={(e) => setAttendeeEmails(e.target.value)}
          placeholder="e.g., friend@example.com, colleague@example.com"
          className="bg-white border-amber-300 focus:ring-primary mt-1"
          disabled={isPending}
        />
      </div>
      <div>
        <Label htmlFor="meetingTopic" className="text-neutral-700 font-medium">Meeting Topic</Label>
        <Input
          id="meetingTopic"
          value={meetingTopic}
          onChange={(e) => setMeetingTopic(e.target.value)}
          placeholder="e.g., Project Alpha Review"
          className="bg-white border-amber-300 focus:ring-primary mt-1"
          disabled={isPending}
        />
      </div>


      <Button onClick={handleSubmit} disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
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
              <CalendarCheck2 className="mr-2 h-5 w-5" /> Scheduling Suggestion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-neutral-700">
            <div>
              <h4 className="font-semibold text-neutral-800">Suggested Slot:</h4>
              <p className="text-sm bg-white p-2 rounded border border-amber-100">{result.suggestedSlot}</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-800">Confirmation Preview:</h4>
              <p className="text-sm bg-white p-2 rounded border border-amber-100 italic">{result.confirmationMessage}</p>
            </div>
            <p className="text-xs text-neutral-500 pt-2">Simulated scheduling. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
      {!result && !error && !isPending && (
         <div className="text-center text-neutral-500 py-8 border-2 border-dashed border-amber-200 rounded-lg">
            <CalendarCheck2 size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your scheduling suggestion will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default ScheduleSyncDemo;
