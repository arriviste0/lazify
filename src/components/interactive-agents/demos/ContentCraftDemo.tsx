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
        const response = await fetch('/api/interactive-agents/content-craft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'generateContent',
            data: { prompt, contentType },
          }),
        });

        const responseData = await response.json();

        if (!response.ok || !responseData.success) {
          const errorMessage = responseData.message || "An error occurred while generating content.";
          setError(errorMessage);
          toast({ variant: "destructive", title: "Error", description: errorMessage });
        } else {
          setResult({
            generatedContent: responseData.content,
            contentTypeUsed: contentType,
          });
        }
      } catch (e: any) {
        setError(e.message || "An error occurred while generating content.");
        toast({ variant: "destructive", title: "Error", description: e.message || "An unexpected error occurred." });
      }
    });
  };

  const handleCopy = () => {
    if (result?.generatedContent) {
      navigator.clipboard.writeText(result.generatedContent);
      toast({ title: "Content Copied!", description: "The generated content has been copied to your clipboard." });
    }
  };

  // Extract color name for dynamic class generation, e.g., "rose" from "bg-rose-500"
  const colorName = agent.themeColorClass.replace('bg-', '').split('-')[0];
  const demoButtonClass = `bg-${colorName}-500 hover:bg-${colorName}-600`;
  const demoInputFocusClass = `focus:ring-${colorName}-500`;
  const demoCardAccentBorder = `border-${colorName}-200`;
  const demoCardAccentBg = `bg-${colorName}-50`;
  const demoCardAccentText = `text-${colorName}-700`;
  const demoResultCardAccentBorder = `border-${colorName}-200`;
  const demoResultCardAccentBg = `bg-${colorName}-50`;
  const demoResultCardAccentText = `text-${colorName}-700`;


  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="prompt" className="font-medium text-foreground/90">Enter Your Content Prompt</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Write a short blog post about the benefits of AI in marketing...'"
          className={`min-h-[120px] bg-background/30 border-border ${demoInputFocusClass} mt-1`}
          disabled={isPending}
        />
      </div>
      <div>
        <Label htmlFor="contentType" className="font-medium text-foreground/90">Select Content Type</Label>
        <Select value={contentType} onValueChange={(value: ContentCraftInput["contentType"]) => setContentType(value)} disabled={isPending}>
          <SelectTrigger className={`w-full bg-background/30 border-border ${demoInputFocusClass} mt-1 text-foreground`}>
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent className={`bg-popover text-popover-foreground border-${colorName}-500/50`}>
            <SelectItem value="blogPost">Blog Post</SelectItem>
            <SelectItem value="socialMediaCaption">Social Media Caption</SelectItem>
            <SelectItem value="productDescription">Product Description</SelectItem>
            <SelectItem value="emailDraft">Email Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className={`w-full text-white ${demoButtonClass}`}>
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

      {error && !isPending && (
        <Card className={`bg-destructive/10 ${demoCardAccentBorder}`}>
          <CardHeader><CardTitle className="text-destructive flex items-center"><AlertTriangle className="mr-2 h-5 w-5" /> Error</CardTitle></CardHeader>
          <CardContent><p className="text-destructive/90">{error}</p></CardContent>
        </Card>
      )}

      {result && (
        <Card className={`${demoResultCardAccentBg} ${demoResultCardAccentBorder}`}>
          <CardHeader>
            <CardTitle className={`${demoResultCardAccentText} flex items-center justify-between`}>
              <div className="flex items-center">
                <Edit3 className="mr-2 h-5 w-5" /> Generated Content
              </div>
              <Button variant="ghost" size="sm" onClick={handleCopy} className={`${demoResultCardAccentText} hover:bg-${colorName}-100`}>
                <Copy className="mr-1.5 h-4 w-4" /> Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap bg-background/50 p-3 rounded border border-border text-foreground max-h-[200px] overflow-y-auto">{result.generatedContent}</pre>
            <p className="text-xs text-muted-foreground pt-2">Simulated generation. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
       {!result && !error && !isPending && (
         <div className={`text-center text-muted-foreground py-8 border-2 border-dashed ${demoCardAccentBorder} rounded-lg bg-background/20`}>
            <Edit3 size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your AI-generated content will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default ContentCraftDemo;
