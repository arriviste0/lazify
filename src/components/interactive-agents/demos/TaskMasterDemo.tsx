
"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, ListChecks, Zap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { handleTaskMasterAction } from "@/app/interactive-agents/actions/taskMasterActions";
import type { TaskMasterInput, TaskMasterOutput } from "@/ai/flows/interactive-demos/demoTaskMasterFlow";
import { useToast } from "@/hooks/use-toast";

interface TaskMasterDemoProps {
  agent: InteractiveAgentInfo;
}

const TaskMasterDemo: React.FC<TaskMasterDemoProps> = ({ agent }) => {
  const [taskList, setTaskList] = useState("");
  const [result, setResult] = useState<TaskMasterOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!taskList.trim()) {
      setError("Please enter a list of tasks.");
      return;
    }
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await handleTaskMasterAction({ tasks: taskList });
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
        setError(e.message || "An error occurred while prioritizing tasks.");
        toast({ variant: "destructive", title: "Error", description: e.message || "An unexpected error occurred." });
      }
    });
  };

  const sampleTasks = `
- Finish Q3 report by Friday
- Email client about project update
- Buy groceries (milk, eggs, bread)
- Schedule team meeting for next Monday
- Prepare presentation slides for Q1 review
- Book flights to Bali for Dec 15-30
- Find hotel near Seminyak
`.trim();

  // Extract color name for dynamic class generation, e.g., "green" from "bg-green-500"
  const colorName = agent.themeColorClass.replace('bg-', '').split('-')[0];
  const demoButtonClass = `bg-${colorName}-500 hover:bg-${colorName}-600`;
  const demoInputFocusClass = `focus:ring-${colorName}-500`;
  const demoCardAccentBorder = `border-${colorName}-200`;
  const demoCardAccentBg = `bg-${colorName}-50`;
  const demoCardAccentText = `text-${colorName}-700`;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="taskList" className="font-medium text-foreground/90">Enter Your Tasks (one per line)</Label>
        <Textarea
          id="taskList"
          value={taskList}
          onChange={(e) => setTaskList(e.target.value)}
          placeholder="e.g., Finalize report\nCall John\nBuy groceries"
          className={`min-h-[150px] bg-background/30 border-border ${demoInputFocusClass} mt-1`}
          disabled={isPending}
        />
         <Button variant="outline" size="sm" onClick={() => setTaskList(sampleTasks)} className={`mt-2 border-${colorName}-500/50 text-${colorName}-600 hover:bg-${colorName}-500/10`} disabled={isPending}>
          Use Sample Tasks
        </Button>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className={`w-full text-white ${demoButtonClass}`}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Prioritizing...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4" /> Prioritize Tasks
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
              <ListChecks className="mr-2 h-5 w-5" /> Prioritized Task List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground/90">
            {result.prioritizedTasks.length > 0 ? (
              <ul className="space-y-2">
                {result.prioritizedTasks.map((task, index) => (
                  <li key={index} className="p-2 bg-background/50 rounded border border-border flex justify-between items-center">
                    <span>{task.task}</span>
                    <span 
                      className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${
                        task.priority === "High" ? "bg-red-500" :
                        task.priority === "Medium" ? "bg-yellow-500 text-black" :
                        `bg-${colorName}-500` // Use agent theme for Low priority as a base
                      }`}
                    >
                      {task.priority}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks to display.</p>
            )}
            <p className="text-xs text-muted-foreground pt-2">{result.summary}</p>
            <p className="text-xs text-muted-foreground pt-1">Simulated prioritization. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
      {!result && !error && !isPending && (
         <div className={`text-center text-muted-foreground py-8 border-2 border-dashed ${demoCardAccentBorder} rounded-lg bg-background/20`}>
            <ListChecks size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your prioritized tasks will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default TaskMasterDemo;
