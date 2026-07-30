import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripe = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16',
  });

export async function POST(request: Request) {
  const stripe = getStripe();

  try {
    const { houseName, customerName, customerEmail, customerPhone } = await request.json();

    // Create Stripe checkout session for €1000 deposit
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Acompte de réservation - ${houseName}`,
              description: `Acompte de 1.000€ pour réserver votre maison ${houseName}`,
            },
            unit_amount: 100000, // 1000 EUR in cents
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      metadata: {
        customerName,
        customerPhone,
        houseModel: houseName,
        depositAmount: '100000',
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/catalogue`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}