import { NextRequest, NextResponse } from 'next/server';
import { demoInboxZero } from '@/ai/flows/interactive-demos/demoInboxZeroFlow';
import type { InboxZeroInput } from '@/ai/flows/interactive-demos/demoInboxZeroFlow';

export async function POST(request: NextRequest) {
  try {
    const body: InboxZeroInput = await request.json();
    
    // Validate input
    if (!body.emailContent || body.emailContent.length < 5) {
      return NextResponse.json(
        { error: "Email content must be at least 5 characters." },
        { status: 400 }
      );
    }

    const result = await demoInboxZero(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in inbox-zero API:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred processing email." },
      { status: 500 }
    );
  }
} 