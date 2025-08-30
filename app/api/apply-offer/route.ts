import { NextRequest, NextResponse } from 'next/server';
import { applyDiscount, pauseSubscription } from '../../../lib/stripe';
import { logEvent, saveConversation } from '../../../lib/supabase';

interface ApplyOfferRequest {
  tenantId: string;
  customerId: string;
  offer: {
    offerType: 'discount' | 'pause' | 'downgrade' | 'none';
    offerValue: string;
    message: string;
    conversationId?: string;
  };
  accepted: boolean;
  subscriptionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ApplyOfferRequest = await request.json();
    const { tenantId, customerId, offer, accepted, subscriptionId } = body;

    if (!tenantId || !customerId || !offer) {
      return NextResponse.json(
        { error: 'Missing required fields: tenantId, customerId, offer' },
        { status: 400 }
      );
    }

    // Log the event regardless of acceptance
    const eventData = {
      customer_id: customerId,
      offer_type: offer.offerType,
      offer_value: offer.offerValue,
      accepted: accepted,
      message: offer.message,
      conversation_id: offer.conversationId,
    };

    try {
      await logEvent(tenantId, 'offer_response', eventData);
    } catch (error) {
      console.error('Error logging event:', error);
    }

    // Update conversation record
    try {
      await saveConversation({
        tenant_id: tenantId,
        customer_email: customerId, // In production, resolve customer ID to email
        reason: 'cancellation_attempt',
        offer_type: offer.offerType,
        offer_value: offer.offerValue,
        accepted: accepted,
      });
    } catch (error) {
      console.error('Error updating conversation:', error);
    }

    // If offer was declined, just return success
    if (!accepted) {
      return NextResponse.json({
        success: true,
        message: 'Offer declined, logged for analytics',
        action: 'declined'
      });
    }

    // If offer was accepted, apply it via Stripe
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID required to apply offer' },
        { status: 400 }
      );
    }

    let stripeResult;

    try {
      switch (offer.offerType) {
        case 'discount':
          const discountPercent = parseInt(offer.offerValue);
          stripeResult = await applyDiscount({
            subscriptionId,
            discountPercent,
            durationInMonths: 3 // Default to 3 months
          });
          break;

        case 'pause':
          const pauseMonths = parseInt(offer.offerValue);
          stripeResult = await pauseSubscription({
            subscriptionId,
            pauseDurationInMonths: pauseMonths
          });
          break;

        case 'downgrade':
          // For downgrade, you would typically update the subscription to a different price
          // This is a simplified implementation
          stripeResult = {
            success: true,
            message: 'Downgrade request received - will be processed manually'
          };
          break;

        default:
          return NextResponse.json(
            { error: 'Invalid offer type' },
            { status: 400 }
          );
      }

      if (!stripeResult.success) {
        throw new Error(stripeResult.error || 'Stripe operation failed');
      }

      // Log successful application
      await logEvent(tenantId, 'offer_applied', {
        ...eventData,
        stripe_result: stripeResult,
        subscription_id: subscriptionId
      });

      return NextResponse.json({
        success: true,
        message: 'Offer applied successfully',
        action: 'applied',
        details: stripeResult
      });

    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      
      // Log the failure
      await logEvent(tenantId, 'offer_application_failed', {
        ...eventData,
        error: stripeError instanceof Error ? stripeError.message : 'Unknown error',
        subscription_id: subscriptionId
      });

      return NextResponse.json(
        { 
          error: 'Failed to apply offer',
          details: stripeError instanceof Error ? stripeError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Apply offer API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'ChurnAI Apply Offer API',
    version: '1.0.0',
    endpoints: {
      POST: 'Apply retention offer via Stripe and log to Supabase'
    },
    supportedOffers: ['discount', 'pause', 'downgrade']
  });
}
