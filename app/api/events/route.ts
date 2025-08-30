import { NextRequest, NextResponse } from 'next/server';
import { logEvent } from '../../../lib/supabase';

interface EventRequest {
  tenantId: string;
  eventType: string;
  eventData: Record<string, unknown>;
  customerEmail?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EventRequest = await request.json();
    const { tenantId, eventType, eventData, customerEmail } = body;

    if (!tenantId || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields: tenantId, eventType' },
        { status: 400 }
      );
    }

    // Add metadata to event data
    const enrichedEventData = {
      ...eventData,
      customerEmail,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    } as Record<string, unknown>;

    // Log event to Supabase
    try {
      await logEvent(tenantId, eventType, enrichedEventData);
    } catch (error) {
      console.error('Error logging event to Supabase:', error);
      // Continue even if logging fails
    }

    return NextResponse.json({
      success: true,
      message: 'Event logged successfully',
      eventType,
      tenantId
    });

  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'ChurnAI Events API',
    version: '1.0.0',
    endpoints: {
      POST: 'Log events to Supabase for analytics'
    },
    supportedEvents: [
      'widget_loaded',
      'cancel_attempt',
      'offer_shown',
      'offer_accepted',
      'offer_declined',
      'page_view'
    ]
  });
}
