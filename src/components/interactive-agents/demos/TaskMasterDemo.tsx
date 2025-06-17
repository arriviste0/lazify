
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

interface TaskMasterDemoProps {
  agent: InteractiveAgentInfo;
}

const TaskMasterDemo: React.FC<TaskMasterDemoProps> = ({ agent }) => {
  const [taskList, setTaskList] = useState("");
  const [result, setResult] = useState<TaskMasterOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
        } else if (response) {
          setResult(response);
        } else {
          setError("Received an unexpected response from the agent.");
        }
      } catch (e: any) {
        setError(e.message || "An error occurred while prioritizing tasks.");
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

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="taskList" className="text-neutral-700 font-medium">Enter Your Tasks (one per line)</Label>
        <Textarea
          id="taskList"
          value={taskList}
          onChange={(e) => setTaskList(e.target.value)}
          placeholder="e.g., Finalize report&#10;Call John&#10;Buy groceries"
          className="min-h-[150px] bg-white border-amber-300 focus:ring-primary mt-1"
          disabled={isPending}
        />
         <Button variant="outline" size="sm" onClick={() => setTaskList(sampleTasks)} className="mt-2 border-primary text-primary hover:bg-primary/10" disabled={isPending}>
          Use Sample Tasks
        </Button>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
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
              <ListChecks className="mr-2 h-5 w-5" /> Prioritized Task List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-neutral-700">
            {result.prioritizedTasks.length > 0 ? (
              <ul className="space-y-2">
                {result.prioritizedTasks.map((task, index) => (
                  <li key={index} className="p-2 bg-white rounded border border-amber-100 flex justify-between items-center">
                    <span>{task.task}</span>
                    <span 
                      className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${
                        task.priority === "High" ? "bg-red-500" :
                        task.priority === "Medium" ? "bg-yellow-500 text-black" :
                        "bg-green-500" 
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
            <p className="text-xs text-neutral-500 pt-2">{result.summary}</p>
            <p className="text-xs text-neutral-500 pt-1">Simulated prioritization. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
      {!result && !error && !isPending && (
         <div className="text-center text-neutral-500 py-8 border-2 border-dashed border-amber-200 rounded-lg">
            <ListChecks size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your prioritized tasks will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default TaskMasterDemo;
