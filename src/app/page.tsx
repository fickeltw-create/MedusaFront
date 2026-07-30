'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import WhyModura from '@/components/sections/WhyModura';
import StatsSection from '@/components/sections/StatsSection';
import CatalogPreview from '@/components/sections/CatalogPreview';
import FAQSection from '@/components/sections/FAQSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <WhyModura />
      <CatalogPreview />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
