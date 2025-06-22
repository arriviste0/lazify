import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'findLeads':
        // Simulate lead finding
        const leads = [
          {
            id: 1,
            name: 'John Doe',
            company: 'Tech Corp',
            email: 'john@techcorp.com',
            score: 85
          },
          {
            id: 2,
            name: 'Jane Smith',
            company: 'Innovation Inc',
            email: 'jane@innovation.com',
            score: 92
          }
        ];
        return NextResponse.json({ 
          success: true, 
          leads,
          message: 'Leads found successfully'
        });

      case 'qualifyLead':
        // Simulate lead qualification
        const qualification = {
          leadId: data.leadId,
          qualified: true,
          score: 88,
          notes: 'High potential customer based on company size and industry'
        };
        return NextResponse.json({ 
          success: true, 
          qualification,
          message: 'Lead qualified successfully'
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