import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import Stripe from 'stripe';


export default async function ReservationSuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const sessionId = searchParams.session_id;
  let session: Stripe.Checkout.Session | null = null;
  let reservationUpdated = false;

  if (sessionId) {
    try {
      // Load payment services only when a real checkout session is provided.
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: '2023-10-16',
      });
      session = await stripe.checkout.sessions.retrieve(sessionId);
      
      // Update reservation status in Supabase
      if (session?.metadata?.houseModel && session?.metadata?.customerEmail) {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase
          .from('reservations')
          .update({ 
            status: 'paid',
            stripe_session_id: sessionId,
            payment_completed_at: new Date().toISOString()
          })
          .eq('email', session.metadata.customerEmail)
          .eq('model', session.metadata.houseModel)
          .eq('status', 'pending_payment');
          
        if (!error) {
          reservationUpdated = true;
        }
      }
    } catch (error) {
      console.error('Error retrieving Stripe session:', error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Réservation confirmée !</h1>
          
          {session && (
            <div className="mb-8 text-left bg-gray-50 rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4">Détails de votre réservation</h2>
              <div className="space-y-2 text-gray-600">
                <p><strong>Modèle:</strong> {session.metadata?.houseModel}</p>
                <p><strong>Email:</strong> {session.customer_details?.email}</p>
                <p><strong>Montant payé:</strong> €1,000.00 (acompte)</p>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 mb-2">
            Merci pour votre achat. Votre acompte a été traité avec succès.
          </p>
          <p className="text-gray-600 mb-8">
            Nous vous contacterons dans les 24h pour finaliser votre commande.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogue">
              <button className="flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <ChevronLeft className="h-5 w-5" />
                Retour au catalogue
              </button>
            </Link>
            <Link href="/">
              <button className="btn-primary px-8 py-3">
                Retour à l'accueil
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}