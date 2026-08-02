'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { HOUSES } from '@/lib/houses';
import { ArrowRight } from 'lucide-react';

// Placeholder promo images - these can be easily replaced later
const PROMO_IMAGES: Record<string, string> = {
  'maison-etudiante': '/promo/Maison etudiante .jpeg',
  'tiny-house': '/promo/tiny-house-promo.jpg',
  'maison-appartement': '/promo/apartment-house-promo.jpg',
  'maison-familiale': '/promo/family-house-promo.jpg',
  'space-capsule': '/promo/space-capsule-promo.jpg',
};

export default function PromotionPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#0F172A] pt-28 pb-16">
        <div className="container-wide">
          <div className="max-w-2xl">
            <span className="label-badge bg-white/10 text-white/60 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              {t.promotions.exclusiveOffers}
            </span>
            <h1 className="font-syne font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              {t.nav.promotion}
            </h1>
            <p className="text-white/60 text-lg">
              {t.promotions.heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Promotion Grid */}
      <section className="py-14 bg-white">
          <div className="container-wide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
               {HOUSES.map((house) => {
                 const model = t.models[house.key];
                 // Map each house to its specific promo image
                 const getPromoImage = (slug: string) => {
                   switch(slug) {
                     case 'maison-etudiante':
                       return '/promo/Maison etudiante .jpeg';
                     case 'tiny-house':
                       return '/promo/Tiny house.png';
                     case 'maison-appartement':
                       return '/promo/Maison Appartement.png';
                     case 'maison-familiale':
                       return '/promo/Maison Familiale.png';
                     case 'space-capsule':
                       return '/promo/space capsule.png';
                     default:
                       return '/promo/Maison etudiante .jpeg';
                   }
                 };
                 const promoImage = getPromoImage(house.slug);
                 
                 return (
                   <Link
                      key={house.slug}
                      href={`/promotion/${house.slug}`}
                      className="group relative overflow-hidden rounded-2xl aspect-auto w-full cursor-pointer"
                      style={{ height: 'auto' }}
                    >
                      {/* Promo Image */}
                       <img
                           src={promoImage}
                           alt={model.name}
                           className="w-full h-auto object-contain bg-white transition-transform duration-700 hover:scale-105"
                           onError={(e) => {
                             // Fallback to existing house image if promo image fails to load
                             const target = e.target as HTMLImageElement;
                             target.src = house.image;
                             target.className = "w-full h-auto object-contain bg-white transition-transform duration-700 hover:scale-105";
                           }}
                          />
                    {/* Black overlay reduced from 50% to ~35% opacity */}
                    <div className="absolute inset-0 bg-black/35 transition-opacity duration-300 group-hover:bg-black/45" />
                  
                  {/* Centered text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="label-badge bg-[#2563EB] text-white mb-3">-{house.discount}%</span>
                    <h3 className="font-syne font-bold text-3xl text-white mb-2">{model.name}</h3>
                    <p className="text-white/80 text-sm mb-4">{house.size} m²</p>
                    <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
                      <span className="text-sm font-medium">{t.promotions.discoverOffer}</span>
                      <ArrowRight size={16} className="transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#F8FAFC] py-16 border-t border-gray-100">
        <div className="container-wide text-center">
          <h2 className="font-syne font-bold text-3xl text-[#0F172A] mb-3">
            {t.promotions.needMoreInfo}
          </h2>
          <p className="text-[#6B7280] mb-6 max-w-2xl mx-auto">
            {t.promotions.ctaDescription}
          </p>
          <Link href="/contact" className="btn-primary group">
            Contactez-nous <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}