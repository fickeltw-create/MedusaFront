import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutClient from './CheckoutClient';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <CheckoutClient />
      <Footer />
    </main>
  );
}