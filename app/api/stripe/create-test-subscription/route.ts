import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    // Create a test customer
    const customer = await stripe.customers.create({
      email: `test${Date.now()}@churnai.com`,
      name: 'Test Customer',
      metadata: {
        tenant_id: '00000000-0000-0000-0000-000000000000'
      }
    });

    // Create a test product and price if needed
    let price;
    try {
      // Try to use existing price
      price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_STARTER || 'price_test');
    } catch {
      // Create a test product and price
      const product = await stripe.products.create({
        name: 'Test Subscription',
      });

      price = await stripe.prices.create({
        product: product.id,
        unit_amount: 2900, // $29.00
        currency: 'usd',
        recurring: { interval: 'month' },
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        tenant_id: '00000000-0000-0000-0000-000000000000'
      }
    });

    return NextResponse.json({
      customerId: customer.id,
      subscriptionId: subscription.id,
      priceId: price.id,
      status: subscription.status,
      message: 'Test subscription created. Use this to test the cancel flow.'
    });
  } catch (error: any) {
    console.error('Test subscription creation error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
