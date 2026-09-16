import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

export default function ProductPage() {
  notFound();
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#0f172a]">
      <Navbar />
      <section className="pt-28 pb-16">
        <div className="container-wide rounded-[2rem] border border-gray-100 bg-white p-10 shadow-premium">
          <h1 className="font-syne text-3xl font-bold">Medusa</h1>
          <p className="mt-3 text-gray-500">Product detail pages are disabled while the catalog is being rebuilt around Medusa.</p>
          <Link href="/shop" className="mt-6 inline-flex rounded-2xl bg-[#0f172a] px-5 py-3 font-semibold text-white hover:bg-[#1e293b]">
            Return to Medusa page
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
