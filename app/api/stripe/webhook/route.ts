import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { logEvent } from '../../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    console.error('Webhook signature verification failed:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;

      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(failedInvoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);
  
  try {
    await logEvent(
      'stripe-webhook',
      'checkout_completed',
      {
        sessionId: session.id,
        customerId: session.customer,
        subscriptionId: session.subscription,
        amount: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email
      }
    );
  } catch (error) {
    console.error('Error logging checkout completion:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  
  try {
    await logEvent(
      'stripe-webhook',
      'subscription_created',
      {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        priceId: subscription.items.data[0]?.price.id,
        amount: subscription.items.data[0]?.price.unit_amount,
        interval: subscription.items.data[0]?.price.recurring?.interval
      }
    );
  } catch (error) {
    console.error('Error logging subscription creation:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  try {
    await logEvent(
      'stripe-webhook',
      'subscription_updated',
      {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        priceId: subscription.items.data[0]?.price.id,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    );
  } catch (error) {
    console.error('Error logging subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  try {
    await logEvent(
      'stripe-webhook',
      'subscription_deleted',
      {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        canceledAt: subscription.canceled_at
      }
    );
  } catch (error) {
    console.error('Error logging subscription deletion:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded:', invoice.id);
  
  try {
    await logEvent(
      'stripe-webhook',
      'payment_succeeded',
      {
        invoiceId: invoice.id,
        subscriptionId: (invoice as { subscription?: string }).subscription,
        customerId: invoice.customer,
        amount: invoice.amount_paid,
        currency: invoice.currency
      }
    );
  } catch (error) {
    console.error('Error logging payment success:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed:', invoice.id);
  
  try {
    await logEvent(
      'stripe-webhook',
      'payment_failed',
      {
        invoiceId: invoice.id,
        subscriptionId: (invoice as { subscription?: string }).subscription,
        customerId: invoice.customer,
        amount: invoice.amount_due,
        currency: invoice.currency,
        attemptCount: invoice.attempt_count
      }
    );
  } catch (error) {
    console.error('Error logging payment failure:', error);
  }
}
