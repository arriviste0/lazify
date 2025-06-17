
"use client";
import React, { useState, useTransition } from "react";
import type { InteractiveAgentInfo } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertTriangle, ShoppingCart, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { handleShopSmartAction } from "@/app/interactive-agents/actions/shopSmartActions";
import type { ShopSmartInput, ShopSmartOutput, ProductRecommendation } from "@/ai/flows/interactive-demos/demoShopSmartFlow";

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
        } else if (response) {
          setResult(response);
        } else {
          setError("Received an unexpected response from the agent.");
        }
      } catch (e: any) {
        setError(e.message || "An error occurred while finding products.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="productInterest" className="text-neutral-700 font-medium">What are you looking for?</Label>
        <Input
          id="productInterest"
          value={productInterest}
          onChange={(e) => setProductInterest(e.target.value)}
          placeholder="e.g., 'running shoes', 'summer dress', 'laptop for coding'"
          className="bg-white border-amber-300 focus:ring-primary mt-1"
          disabled={isPending}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ageGroup" className="text-neutral-700 font-medium">Age Group</Label>
          <Select value={ageGroup} onValueChange={(value: ShopSmartInput["ageGroup"]) => setAgeGroup(value)} disabled={isPending}>
            <SelectTrigger className="w-full bg-white border-amber-300 focus:ring-primary mt-1 text-neutral-800">
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent className="bg-amber-50 text-neutral-800">
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="teen">Teen (13-19)</SelectItem>
              <SelectItem value="youngAdult">Young Adult (20-35)</SelectItem>
              <SelectItem value="adult">Adult (36-55)</SelectItem>
              <SelectItem value="senior">Senior (55+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="gender" className="text-neutral-700 font-medium">Gender</Label>
          <Select value={gender} onValueChange={(value: ShopSmartInput["gender"]) => setGender(value)} disabled={isPending}>
            <SelectTrigger className="w-full bg-white border-amber-300 focus:ring-primary mt-1 text-neutral-800">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-amber-50 text-neutral-800">
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
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
              <ShoppingCart className="mr-2 h-5 w-5" /> Product Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-neutral-700">
            {result.recommendations && result.recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.recommendations.map((product: ProductRecommendation, index: number) => (
                  <Card key={index} className="bg-white border-amber-100 overflow-hidden shadow-sm">
                    <div className="relative w-full h-40">
                      <Image
                        src={product.imageUrl || `https://placehold.co/300x200.png?text=${encodeURIComponent(product.name)}`}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={`${product.name} product image`}
                      />
                    </div>
                    <CardContent className="p-3">
                      <h5 className="font-semibold text-neutral-800 text-sm truncate" title={product.name}>{product.name}</h5>
                      <p className="text-primary font-bold text-sm mt-1">₹{product.price.toFixed(2)}</p>
                      <Button variant="outline" size="sm" className="w-full mt-2 text-xs border-primary text-primary hover:bg-primary/10">View Details</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm">No product recommendations found for your criteria.</p>
            )}
            {result.qnaResponse && (
                 <div>
                    <h4 className="font-semibold text-neutral-800 mt-4">ShopSmart Assistant:</h4>
                    <p className="text-sm bg-white p-3 rounded border border-amber-100 italic">{result.qnaResponse}</p>
                </div>
            )}
            <p className="text-xs text-neutral-500 pt-2">Simulated recommendations. For demo purposes only.</p>
          </CardContent>
        </Card>
      )}
      {!result && !error && !isPending && (
         <div className="text-center text-neutral-500 py-8 border-2 border-dashed border-amber-200 rounded-lg">
            <ShoppingCart size={40} className="mx-auto mb-2 opacity-50" />
            <p>Your product recommendations will appear here.</p>
        </div>
       )}
    </div>
  );
};

export default ShopSmartDemo;
