import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripe = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16',
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
      const { supabase } = await import('@/lib/supabase');
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Update reservation in Supabase when payment is completed
      if (session.metadata?.customerEmail && session.metadata?.houseModel) {
        const { error } = await supabase
          .from('reservations')
          .update({
            status: 'paid',
            stripe_session_id: session.id,
            payment_completed_at: new Date().toISOString(),
            payment_intent: session.payment_intent,
          })
          .eq('email', session.metadata.customerEmail)
          .eq('model', session.metadata.houseModel)
          .eq('status', 'pending_payment');

        if (error) {
          console.error('Error updating reservation:', error);
          return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
        }

        console.log(`Payment completed for reservation: ${session.metadata.houseModel} - ${session.metadata.customerEmail}`);
      }
      break;
    }
    
    case 'checkout.session.async_payment_failed': {
      const { supabase } = await import('@/lib/supabase');
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Mark reservation as payment failed
      if (session.metadata?.customerEmail && session.metadata?.houseModel) {
        await supabase
          .from('reservations')
          .update({
            status: 'payment_failed',
            stripe_session_id: session.id,
          })
          .eq('email', session.metadata.customerEmail)
          .eq('model', session.metadata.houseModel);
          
        console.log(`Payment failed for: ${session.metadata.customerEmail}`);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}