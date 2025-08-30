import { NextRequest, NextResponse } from 'next/server';
import { saveConversation } from '../../../lib/supabase';

interface DecisionRequest {
  tenantId: string;
  reason: string;
  customerEmail: string;
  subscriptionId?: string;
}

interface PlaybookRule {
  reason: string;
  offerType: 'discount' | 'pause' | 'downgrade' | 'none';
  value: string;
  message: string;
  priority: number;
}

// Playbook rules - in production, these would be stored in database per tenant
const defaultPlaybook: PlaybookRule[] = [
  {
    reason: 'too-expensive',
    offerType: 'discount',
    value: '25',
    message: 'We understand budget is important! How about 25% off for the next 3 months?',
    priority: 1
  },
  {
    reason: 'not-using',
    offerType: 'pause',
    value: '2',
    message: 'No problem! We can pause your subscription for 2 months so you can come back when ready.',
    priority: 1
  },
  {
    reason: 'found-alternative',
    offerType: 'discount',
    value: '30',
    message: 'We hate to see you go! How about 30% off for 6 months to reconsider?',
    priority: 1
  },
  {
    reason: 'too-complex',
    offerType: 'downgrade',
    value: 'basic',
    message: 'Let\'s simplify things! We can move you to our basic plan at 50% off.',
    priority: 2
  },
  {
    reason: 'budget-cuts',
    offerType: 'pause',
    value: '3',
    message: 'We understand! We can pause your subscription for 3 months until things improve.',
    priority: 1
  }
];

function matchReasonToOffer(reason: string, tenantId: string): PlaybookRule {
  // In production, fetch tenant-specific playbook from database
  const playbook = defaultPlaybook;
  
  // Find exact match first
  let match = playbook.find(rule => rule.reason === reason);
  
  // If no exact match, try partial matches or fallback
  if (!match) {
    if (reason.includes('expensive') || reason.includes('cost') || reason.includes('price')) {
      match = playbook.find(rule => rule.reason === 'too-expensive');
    } else if (reason.includes('using') || reason.includes('need')) {
      match = playbook.find(rule => rule.reason === 'not-using');
    } else if (reason.includes('alternative') || reason.includes('competitor')) {
      match = playbook.find(rule => rule.reason === 'found-alternative');
    }
  }
  
  // Default fallback
  if (!match) {
    match = {
      reason: 'default',
      offerType: 'discount',
      value: '20',
      message: 'We\'d love to keep you! How about 20% off your next 3 months?',
      priority: 3
    };
  }
  
  return match;
}

export async function POST(request: NextRequest) {
  try {
    const body: DecisionRequest = await request.json();
    const { tenantId, reason, customerEmail, subscriptionId } = body;

    if (!tenantId || !reason || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: tenantId, reason, customerEmail' },
        { status: 400 }
      );
    }

    // Match reason to playbook rule
    const offer = matchReasonToOffer(reason, tenantId);
    
    // Create conversation record
    const conversation = {
      tenant_id: tenantId,
      customer_email: customerEmail,
      reason: reason,
      offer_type: offer.offerType,
      offer_value: offer.value,
      accepted: false, // Will be updated when user responds
    };

    // Save conversation to database
    try {
      await saveConversation(conversation);
    } catch (error) {
      console.error('Error saving conversation:', error);
      // Continue even if database save fails
    }

    // Return offer details
    return NextResponse.json({
      success: true,
      offerType: offer.offerType,
      offerValue: offer.value,
      message: offer.message,
      conversationId: conversation.tenant_id + '-' + Date.now(), // Simple ID generation
      metadata: {
        reason: reason,
        priority: offer.priority,
        tenantId: tenantId
      }
    });

  } catch (error) {
    console.error('Decision API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'ChurnAI Decision API',
    version: '1.0.0',
    endpoints: {
      POST: 'Match cancellation reason to retention offer'
    }
  });
}
