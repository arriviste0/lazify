import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'findSlot':
        // Simulate finding available time slots
        const availableSlots = [
          { date: '2024-01-15', time: '10:00 AM', duration: 60 },
          { date: '2024-01-15', time: '2:00 PM', duration: 60 },
          { date: '2024-01-16', time: '9:00 AM', duration: 60 }
        ];
        return NextResponse.json({ 
          success: true, 
          slots: availableSlots,
          message: 'Available slots found'
        });

      case 'scheduleMeeting':
        // Simulate scheduling a meeting
        const meeting = {
          id: 'meeting-123',
          title: data.title,
          date: data.date,
          time: data.time,
          duration: data.duration,
          attendees: data.attendees
        };
        return NextResponse.json({ 
          success: true, 
          meeting,
          message: 'Meeting scheduled successfully'
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