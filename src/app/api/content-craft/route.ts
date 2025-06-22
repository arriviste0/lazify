import { NextRequest, NextResponse } from 'next/server';
import { demoContentCraft } from '@/ai/flows/interactive-demos/demoContentCraftFlow';
import type { ContentCraftInput } from '@/ai/flows/interactive-demos/demoContentCraftFlow';

export async function POST(request: NextRequest) {
  try {
    const body: ContentCraftInput = await request.json();
    
    // Validate input
    if (!body.prompt || body.prompt.length < 10) {
      return NextResponse.json(
        { error: "Prompt must be at least 10 characters." },
        { status: 400 }
      );
    }
    
    if (!body.contentType || !["blogPost", "socialMediaCaption", "productDescription", "emailDraft"].includes(body.contentType)) {
      return NextResponse.json(
        { error: "Invalid content type." },
        { status: 400 }
      );
    }

    const result = await demoContentCraft(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in content-craft API:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred generating content." },
      { status: 500 }
    );
  }
} 