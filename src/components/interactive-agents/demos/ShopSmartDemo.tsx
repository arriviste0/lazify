
"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, ShoppingCart, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { handleShopSmartAction } from "@/app/interactive-agents/actions/shopSmartActions";
import type { ShopSmartInput, ShopSmartOutput, ProductRecommendation } from "@/ai/flows/interactive-demos/demoShopSmartFlow";
import { useToast } from "@/hooks/use-toast";

interface ShopSmartDemoProps {
  agent: InteractiveAgentInfo;
}

const ShopSmartDemo: React.FC<ShopSmartDemoProps> = ({ agent }) => {
  const [productInterest, setProductInterest] = useState("");
  const [ageGroup, setAgeGroup] = useState<ShopSmartInput["ageGroup"]>("any");
  const [gender, setGender] = useState<ShopSmartInput["gender"]>("any");

  const [result, setResult] = useState<ShopSmartOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!productInterest.trim()) {
      setError("Please enter your product interest.");
      return;
    }
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await handleShopSmartAction({ productInterest, ageGroup, gender });
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
        setError(e.message || "An error occurred while finding products.");
        toast({ variant: "destructive", title: "Error", description: e.message || "An unexpected error occurred." });
      }
    });
  };

  // Extract color name for dynamic class generation, e.g., "pink" from "bg-pink-500"
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
        <Label htmlFor="productInterest" className="font-medium text-foreground/90">What are you looking for?</Label>
        <Input
          id="productInterest"
          value={productInterest}
          onChange={(e) => setProductInterest(e.target.value)}
          placeholder="e.g., 'running shoes', 'summer dress', 'laptop for coding'"
          className={`bg-background/30 border-border ${demoInputFocusClass} mt-1`}
          disabled={isPending}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ageGroup" className="font-medium text-foreground/90">Age Group</Label>
          <Select value={ageGroup} onValueChange={(value: ShopSmartInput["ageGroup"]) => setAgeGroup(value)} disabled={isPending}>
            <SelectTrigger className={`w-full bg-background/30 border-border ${demoInputFocusClass} mt-1 text-foreground`}>
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent className={`bg-popover text-popover-foreground border-${colorName}-500/50`}>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="teen">Teen (13-19)</SelectItem>
              <SelectItem value="youngAdult">Young Adult (20-35)</SelectItem>
              <SelectItem value="adult">Adult (36-55)</SelectItem>
              <SelectItem value="senior">Senior (55+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="gender" className="font-medium text-foreground/90">Gender</Label>
          <Select value={gender} onValueChange={(value: ShopSmartInput["gender"]) => setGender(value)} disabled={isPending}>
            <SelectTrigger className={`w-full bg-background/30 border-border ${demoInputFocusClass} mt-1 text-foreground`}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className={`bg-popover text-popover-foreground border-${colorName}-500/50`}>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className={`w-full text-white ${demoButtonClass}`}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" /> Find Products
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
            <CardTitle className={`${demoResultCardAccentText} flex items-center`}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Product Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            {result.recommendations && result.recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.recommendations.map((product: ProductRecommendation, index: number) => (
                  <Card key={index} className="bg-background/50 border-border overflow-hidden shadow-sm">
                    <div className="relative w-full h-40">
                      <Image
                        src={product.imageUrl || `https://placehold.co/300x200.png?text=${encodeURIComponent(product.name)}`}
                        alt={product.name}
                        fill
                        className="object-cover"
                        data-ai-hint={`${product.name} product image`}
                      />
                    </div>
                    <CardContent className="p-3">
                      <h5 className="font-semibold text-foreground text-sm truncate" title={product.name}>{product.name}</h5>
                      <p className={`font-bold text-sm mt-1 text-${colorName}-600`}>₹{product.price.toFixed(2)}</p>
                      <Button variant="outline" size="sm" className={`w-full mt-2 text-xs border-${colorName}-500/70 text-${colorName}-600 hover:bg-${colorName}-500/10`}>View Details</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm">No product recommendations found for your criteria.</p>
            )}
            {result.qnaResponse && (
                 <div>
                    <h4 className={`font-semibold ${demoResultCardAccentText} mt-4`}>ShopSmart Assistant:</h4>
                    <p className="text-sm bg-background/50 p-3 rounded border border-border italic">{result.qnaResponse}</p>
                </div>
            )}
            <p className="text-xs text-muted-foreground pt-2">Simulated recommendations. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
      {!result && !error && !isPending && (
         <div className={`text-center text-muted-foreground py-8 border-2 border-dashed ${demoCardAccentBorder} rounded-lg bg-background/20`}>
            <ShoppingCart size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your product recommendations will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default ShopSmartDemo;
