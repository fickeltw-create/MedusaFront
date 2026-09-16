import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripe = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-06-24.dahlia',
  });

export async function POST(request: Request) {
  const stripe = getStripe();

  try {
    const body = await request.json();
    const { houseName, customerName, customerEmail, customerPhone, items } = body;

    if (Array.isArray(items) && items.length > 0) {
      const subtotal = items.reduce((total: number, item: { price: number; quantity: number }) => {
        const price = Number(item.price);
        const quantity = Number(item.quantity);
        if (!Number.isFinite(price) || price < 0 || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
          throw new Error('Données de panier invalides');
        }
        return total + price * quantity;
      }, 0);
      const shipping = subtotal > 100 ? 0 : 9.99;
      const tax = subtotal * 0.21;

      const lineItems = items.map((item: { name: string; price: number; quantity: number }) => ({
        price_data: {
          currency: 'eur',
          product_data: { name: String(item.name || 'Produit Modura') },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Number(item.quantity),
      }));

      if (shipping > 0) {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: { name: 'Livraison' },
            unit_amount: Math.round(shipping * 100),
          },
          quantity: 1,
        });
      }

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'TVA (21 %)' },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        customer_email: customerEmail,
        metadata: { customerName: customerName || '', customerPhone: customerPhone || '' },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      });

      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

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