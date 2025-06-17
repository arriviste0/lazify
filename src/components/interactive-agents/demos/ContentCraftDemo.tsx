
"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, Edit3, Copy } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { handleContentCraftAction } from "@/app/interactive-agents/actions/contentCraftActions";
import type { ContentCraftInput, ContentCraftOutput } from "@/ai/flows/interactive-demos/demoContentCraftFlow";

interface ContentCraftDemoProps {
  agent: InteractiveAgentInfo;
}

const ContentCraftDemo: React.FC<ContentCraftDemoProps> = ({ agent }) => {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState<ContentCraftInput["contentType"]>("blogPost");
  const [result, setResult] = useState<ContentCraftOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for the content.");
      return;
    }
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await handleContentCraftAction({ prompt, contentType });
        if (response && 'error' in response) {
          setError(response.error);
        } else if (response) {
          setResult(response);
        } else {
          setError("Received an unexpected response from the agent.");
        }
      } catch (e: any) {
        setError(e.message || "An error occurred while generating content.");
      }
    });
  };

  const handleCopy = () => {
    if (result?.generatedContent) {
      navigator.clipboard.writeText(result.generatedContent);
      toast({ title: "Content Copied!", description: "The generated content has been copied to your clipboard." });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="prompt" className="text-neutral-700 font-medium">Enter Your Content Prompt</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Write a short blog post about the benefits of AI in marketing...'"
          className="min-h-[120px] bg-white border-amber-300 focus:ring-primary mt-1"
          disabled={isPending}
        />
      </div>
      <div>
        <Label htmlFor="contentType" className="text-neutral-700 font-medium">Select Content Type</Label>
        <Select value={contentType} onValueChange={(value: ContentCraftInput["contentType"]) => setContentType(value)} disabled={isPending}>
          <SelectTrigger className="w-full bg-white border-amber-300 focus:ring-primary mt-1 text-neutral-800">
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent className="bg-amber-50 text-neutral-800">
            <SelectItem value="blogPost">Blog Post</SelectItem>
            <SelectItem value="socialMediaCaption">Social Media Caption</SelectItem>
            <SelectItem value="productDescription">Product Description</SelectItem>
            <SelectItem value="emailDraft">Email Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
          </>
        ) : (
          <>
            <Edit3 className="mr-2 h-4 w-4" /> Generate Content
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
            <CardTitle className="text-green-700 flex items-center justify-between">
              <div className="flex items-center">
                <Edit3 className="mr-2 h-5 w-5" /> Generated Content
              </div>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="text-green-600 hover:text-green-700 hover:bg-green-100">
                <Copy className="mr-1.5 h-4 w-4" /> Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap bg-white p-3 rounded border border-amber-100 text-neutral-700 max-h-[200px] overflow-y-auto">{result.generatedContent}</pre>
            <p className="text-xs text-neutral-500 pt-2">Simulated generation. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
       {!result && !error && !isPending && (
         <div className="text-center text-neutral-500 py-8 border-2 border-dashed border-amber-200 rounded-lg">
            <Edit3 size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your AI-generated content will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default ContentCraftDemo;
