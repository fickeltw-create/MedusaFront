import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateReservationStatus } from '@/lib/supabase';

const getStripe = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-06-24.dahlia',
  });

export async function POST(request: Request) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;
  
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Update the matching Neon reservation when payment is completed.
      if (session.metadata?.customerEmail && session.metadata?.houseModel) {
        await updateReservationStatus(
          session.id,
          'paid',
          session.metadata.customerEmail,
          session.metadata.houseModel,
        );

        console.log(`Payment completed for reservation: ${session.metadata.houseModel} - ${session.metadata.customerEmail}`);
      }
      break;
    }
    
    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Mark reservation as payment failed
      if (session.metadata?.customerEmail && session.metadata?.houseModel) {
        console.log(`Payment failed for: ${session.metadata.customerEmail}`);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}