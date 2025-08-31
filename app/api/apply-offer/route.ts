import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { 
      subscriptionId, 
      customerId,
      action, 
      payload,
      conversationId,
      tenantId 
    } = await request.json();

    let result: any = null;

    switch (action) {
      case 'discount':
        // Create a coupon programmatically
        const coupon = await stripe.coupons.create({
          percent_off: payload.percent_off || 20,
          duration: 'repeating',
          duration_in_months: payload.duration_months || 3,
          id: `SAVE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        });

        // Apply the coupon to the subscription
        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          discounts: [{
            coupon: coupon.id,
          }],
        });

        result = {
          success: true,
          action: 'discount',
          couponId: coupon.id,
          subscriptionStatus: updatedSubscription.status,
        };

        // Calculate revenue saved (monthly price * discount * months)
        const monthlyAmount = updatedSubscription.items.data[0].price.unit_amount || 0;
        const revenueSaved = (monthlyAmount / 100) * (payload.percent_off / 100) * payload.duration_months;

        // Update conversation with success
        await supabase
          .from('conversations')
          .update({ 
            accepted: true,
            revenue_saved: Math.round(revenueSaved)
          })
          .eq('id', conversationId);

        break;

      case 'pause':
        // Pause the subscription by setting pause_collection
        const pausedSubscription = await stripe.subscriptions.update(subscriptionId, {
          pause_collection: {
            behavior: 'void',
            resumes_at: Math.floor(Date.now() / 1000) + (payload.months * 30 * 24 * 60 * 60),
          },
        });

        result = {
          success: true,
          action: 'pause',
          resumesAt: new Date(pausedSubscription.pause_collection?.resumes_at! * 1000),
          subscriptionStatus: pausedSubscription.status,
        };

        // Calculate revenue saved (monthly amount * pause months)
        const pauseMonthlyAmount = pausedSubscription.items.data[0].price.unit_amount || 0;
        const pauseRevenueSaved = (pauseMonthlyAmount / 100) * payload.months;

        await supabase
          .from('conversations')
          .update({ 
            accepted: true,
            revenue_saved: Math.round(pauseRevenueSaved)
          })
          .eq('id', conversationId);

        break;

      case 'nudge':
        // Just log the nudge action, no Stripe changes needed
        result = {
          success: true,
          action: 'nudge',
          message: payload.message,
        };

        await supabase
          .from('conversations')
          .update({ 
            accepted: true,
            revenue_saved: 0
          })
          .eq('id', conversationId);

        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log event
    await supabase
      .from('events')
      .insert({
        tenant_id: tenantId,
        conversation_id: conversationId,
        type: 'offer_applied',
        data: result,
      });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Apply offer error:', error);
    
    // Log failure event
    await supabase
      .from('events')
      .insert({
        tenant_id: request.headers.get('x-tenant-id'),
        type: 'offer_failed',
        data: { error: error.message },
      });

    return NextResponse.json(
      { error: error.message || 'Failed to apply offer' },
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
