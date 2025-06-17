
"use server";

import type { ShopSmartInput, ShopSmartOutput } from "@/ai/flows/interactive-demos/demoShopSmartFlow";
import { demoShopSmart } from "@/ai/flows/interactive-demos/demoShopSmartFlow";

export async function handleShopSmartAction(input: ShopSmartInput): Promise<ShopSmartOutput | { error: string }> {
  try {
    const result = await demoShopSmart(input);
    return result;
  } catch (e: any) {
    console.error("Error in demoShopSmart server action:", e);
    return { error: e.message || "An unexpected error occurred finding products." };
  }
}
