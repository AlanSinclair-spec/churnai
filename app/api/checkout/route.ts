import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '../../../lib/stripe';

interface CheckoutRequest {
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { priceId, successUrl, cancelUrl } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const defaultSuccessUrl = `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`;
    const defaultCancelUrl = `${baseUrl}?canceled=true`;

    const result = await createCheckoutSession(
      priceId,
      successUrl || defaultSuccessUrl,
      cancelUrl || defaultCancelUrl
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId: result.sessionId,
      url: result.url
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'ChurnAI Checkout API',
    version: '1.0.0',
    endpoints: {
      POST: 'Create Stripe checkout session'
    }
  });
}
