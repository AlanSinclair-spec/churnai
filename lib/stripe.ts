import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export { stripe };

export interface DiscountOptions {
  subscriptionId: string;
  discountPercent: number;
  durationInMonths?: number;
}

export interface PauseOptions {
  subscriptionId: string;
  pauseDurationInMonths: number;
}

export async function applyDiscount({ 
  subscriptionId, 
  discountPercent, 
  durationInMonths = 3 
}: DiscountOptions) {
  try {
    // Create a coupon for the discount
    const coupon = await stripe.coupons.create({
      percent_off: discountPercent,
      duration: durationInMonths > 1 ? 'repeating' : 'once',
      duration_in_months: durationInMonths > 1 ? durationInMonths : undefined,
      name: `ChurnAI Retention Discount ${discountPercent}%`,
    });

    // Apply the coupon to the subscription
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      discounts: [{
        coupon: coupon.id,
      }],
    });

    return {
      success: true,
      subscription,
      coupon,
      message: `${discountPercent}% discount applied for ${durationInMonths} months`
    };
  } catch (error) {
    console.error('Error applying discount:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function pauseSubscription({ 
  subscriptionId, 
  pauseDurationInMonths 
}: PauseOptions) {
  try {
    const pauseUntil = new Date();
    pauseUntil.setMonth(pauseUntil.getMonth() + pauseDurationInMonths);

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: 'void',
        resumes_at: Math.floor(pauseUntil.getTime() / 1000),
      },
    });

    return {
      success: true,
      subscription,
      resumesAt: pauseUntil,
      message: `Subscription paused for ${pauseDurationInMonths} months`
    };
  } catch (error) {
    console.error('Error pausing subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
