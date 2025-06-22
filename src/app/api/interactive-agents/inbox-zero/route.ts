import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'processEmail':
        // Simulate email processing
        const processedEmail = {
          id: data.emailId,
          priority: 'high',
          category: 'work',
          summary: 'Email processed and categorized'
        };
        return NextResponse.json({ 
          success: true, 
          email: processedEmail,
          message: 'Email processed successfully'
        });

      case 'draftReply':
        // Simulate drafting a reply
        const draftReply = `Thank you for your email. I'll get back to you soon regarding ${data.subject}.`;
        return NextResponse.json({ 
          success: true, 
          reply: draftReply,
          message: 'Reply drafted successfully'
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