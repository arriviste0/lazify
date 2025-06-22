import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'generateContent':
        // Simulate content generation
        const generatedContent = `Generated content based on: ${data.prompt}`;
        return NextResponse.json({ 
          success: true, 
          content: generatedContent,
          message: 'Content generated successfully'
        });

      case 'saveToNotion':
        // Simulate saving to Notion
        return NextResponse.json({ 
          success: true, 
          message: 'Content saved to Notion successfully'
        });

      default:
        return NextResponse.json(
          { success: false, message: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 