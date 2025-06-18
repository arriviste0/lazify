
"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, ListChecks, Zap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleTaskMasterAction } from "@/app/interactive-agents/actions/taskMasterActions";
import type { TaskMasterInput, TaskMasterOutput } from "@/ai/flows/interactive-demos/demoTaskMasterFlow";
import type { PrioritizedTaskSchema as TaskType } from "@/ai/flows/interactive-demos/demoTaskMasterFlow"; // Renamed for clarity
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

  const handlePriorityChange = (taskIndex: number, newPriority: TaskType["priority"]) => {
    setResult(prevResult => {
      if (!prevResult) return null;
      const updatedTasks = prevResult.prioritizedTasks.map((task, index) => {
        if (index === taskIndex) {
          return { ...task, priority: newPriority };
        }
        return task;
      });
      return { ...prevResult, prioritizedTasks: updatedTasks };
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

  const colorName = agent.themeColorClass.replace('bg-', '').split('-')[0];
  const demoButtonClass = `bg-${colorName}-500 hover:bg-${colorName}-600`;
  const demoInputFocusClass = `focus:ring-${colorName}-500`;
  const demoCardAccentBorder = `border-${colorName}-200`;
  const demoCardAccentBg = `bg-${colorName}-50`;
  const demoCardAccentText = `text-${colorName}-700`;

  const getPrioritySelectClasses = (priority: TaskType["priority"]) => {
    switch (priority) {
      case "High":
        return `bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20 focus:ring-2 focus:ring-red-400 focus-visible:ring-red-400`;
      case "Medium":
        return `bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/20 focus:ring-2 focus:ring-amber-400 focus-visible:ring-amber-400`;
      case "Low":
        return `bg-${colorName}-500/10 text-${colorName}-700 border-${colorName}-500/30 hover:bg-${colorName}-500/20 focus:ring-2 focus:ring-${colorName}-400 focus-visible:ring-${colorName}-400`;
      default:
        return "bg-muted border-border hover:bg-muted/80 focus:ring-2 focus:ring-ring";
    }
  };


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
                {result.prioritizedTasks.map((taskItem, index) => ( // Renamed task to taskItem
                  <li key={index} className="p-2 bg-background/50 rounded border border-border flex justify-between items-center">
                    <span className="flex-grow pr-2">{taskItem.task}</span>
                    <Select
                      value={taskItem.priority}
                      onValueChange={(newPriority: TaskType["priority"]) => handlePriorityChange(index, newPriority)}
                      disabled={isPending}
                    >
                      <SelectTrigger className={cn("w-[120px] h-8 text-xs", getPrioritySelectClasses(taskItem.priority))}>
                        <SelectValue placeholder="Set priority" />
                      </SelectTrigger>
                      <SelectContent className="text-xs bg-popover text-popover-foreground border-border">
                        <SelectItem value="High" className="text-red-700 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground">High</SelectItem>
                        <SelectItem value="Medium" className="text-amber-700 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground">Medium</SelectItem>
                        <SelectItem value="Low" className={cn(`text-${colorName}-700`, "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground")}>Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks to display.</p>
            )}
            <p className="text-xs text-muted-foreground pt-2">{result.summary}</p>
            <p className="text-xs text-muted-foreground pt-1">Simulated prioritization. Edits are client-side. For demo purposes only.</p>
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

