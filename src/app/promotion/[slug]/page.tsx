'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';
import { HOUSES, formatPrice } from '@/lib/houses';
import { ArrowRight } from 'lucide-react';
import ReservationModal from '@/components/ReservationModal';

// Placeholder promo images - these can be easily replaced later
const PROMO_IMAGES: Record<string, string> = {
  'maison-etudiante': '/promo/student-house-promo.jpg',
  'tiny-house': '/promo/tiny-house-promo.jpg',
  'maison-appartement': '/promo/apartment-house-promo.jpg',
  'maison-familiale': '/promo/family-house-promo.jpg',
  'space-capsule': '/promo/space-capsule-promo.jpg',
};

export default function PromotionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useI18n();
  
  const [showReservation, setShowReservation] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const house = HOUSES.find(h => h.slug === slug);
  if (!house) notFound();
  
  const model = t.models[house.key];
  const promoImage = PROMO_IMAGES[house.slug] || house.image;

  // Student house specific content matching your design
  const isStudentHouse = slug === 'maison-etudiante';

  return (
    <main className="min-h-screen bg-[#FCFBF8] text-[#101C2C] font-sans antialiased">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-[#E4E1D9] pt-20">
        <div className="max-w-[1180px] mx-auto px-8 py-5">
          <nav className="font-mono text-xs text-[#8891A0] tracking-wider uppercase">
            <Link href="/" className="hover:text-[#A9824C] transition-colors">{t.promotions.home}</Link>
            <span className="mx-2">/</span>
            <Link href="/promotion" className="hover:text-[#A9824C] transition-colors">{t.promotions.promotions}</Link>
            <span className="mx-2">/</span>
            <span className="text-[#101C2C] font-medium">{model.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section - Exact match to your design */}
      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-16 items-center">
          <div className="pb-16">
            <span className="font-mono text-xs tracking-[0.14em] uppercase text-[#A9824C] flex items-center gap-2 before:content-[''] before:w-4 before:h-[1px] before:bg-[#A9824C]">
              {t.promotions.limitedOffer}
            </span>
            <h1 className="font-sans font-medium text-[clamp(2rem,5vw,3.25rem)] leading-[1.06] mt-5 mb-5 tracking-tight">
              {model.name}
            </h1>
            <p className="text-[#5B6577] text-base max-w-[420px] leading-relaxed mb-8">
              {model.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-7 mb-11">
              <a 
                href="#financing" 
                className="inline-flex items-center gap-2.5 font-medium text-sm bg-[#101C2C] text-white px-7 py-3.5 rounded-sm hover:bg-[#1D3557] transition-all"
              >
                {t.promotions.viewFinancing}
                <ArrowRight size={15} />
              </a>
              <a 
                href="#space" 
                className="inline-flex items-center gap-2 font-medium text-sm border-b border-[#101C2C] pb-0.5 hover:text-[#2F4C74] hover:border-[#2F4C74] transition-all"
              >
                {t.promotions.seeTheHouse}
                <ArrowRight size={14} />
              </a>
            </div>
            <div className="flex flex-wrap gap-9 pt-6 border-t border-[#E4E1D9]">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] tracking-wider uppercase text-[#8891A0]">{t.promotions.size}</span>
                <span className="font-sans font-semibold text-xl">{house.size} m²</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] tracking-wider uppercase text-[#8891A0]">{t.promotions.price}</span>
                <span className="font-sans font-semibold text-xl">
                  <small className="font-sans text-sm text-[#8891A0] line-through mr-1.5">{formatPrice(house.marketPrice)}</small>
                  {formatPrice(house.price)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] tracking-wider uppercase text-[#8891A0]">{t.promotions.delivery}</span>
                <span className="font-sans font-semibold text-xl">{t.promotions.deliveryWeeks}</span>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-[640px] flex items-center justify-center">
            <div className="relative inline-block">
              <img 
                src={house.images[1]} 
                alt={`${model.name} floor plan`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.error('Hero floor plan failed to load:', house.images[1]);
                  target.src = promoImage || house.image;
                }}
              />
              {/* Top-left corner marker - perfectly aligned to image */}
              <div className="absolute -top-3 -left-3 w-[34px] h-[34px] border-t-2 border-l-2 border-[#A9824C] z-10"></div>
              {/* Bottom-right corner marker - perfectly aligned to image */}
              <div className="absolute -bottom-3 -right-3 w-[34px] h-[34px] border-b-2 border-r-2 border-[#A9824C] z-10"></div>
            </div>
            <span className="absolute left-5 bottom-5 z-10 bg-[#FCFBF8] px-3.5 py-2 font-mono text-[11px] tracking-wider uppercase">
              {t.promotions.floorPlanTopView}
            </span>
          </div>
        </div>
      </section>

      <hr className="border-none border-t border-[#E4E1D9] m-0" />

      {/* The Space Section */}
      <section id="space" className="py-24">
        <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-[72px] items-start">
          <div className="relative">
            {/* Main Image Carousel */}
            <div className="relative overflow-hidden rounded-sm">
              <span className="absolute top-5 left-5 z-10 bg-[#FCFBF8] px-3 py-2 font-mono text-[11px] uppercase tracking-wider">
                {currentImageIndex + 1} / {house.images.length}
              </span>
              <img 
                src={house.images[currentImageIndex]} 
                alt={`${model.name} - view ${currentImageIndex + 1}`} 
                className="w-full h-[560px] object-cover cursor-pointer transition-transform hover:scale-[1.01]"
                onClick={() => setIsLightboxOpen(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = house.image;
                }}
              />
              {/* Carousel Navigation */}
              <button 
                onClick={() => setCurrentImageIndex(prev => prev === 0 ? house.images.length - 1 : prev - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-20"
                aria-label="Previous image"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button 
                onClick={() => setCurrentImageIndex(prev => prev === house.images.length - 1 ? 0 : prev + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-20"
                aria-label="Next image"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
            {/* Thumbnail Strip */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {house.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-16 rounded-sm overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx ? 'border-[#A9824C]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="pt-2">
              <div className="flex justify-between py-4 border-b border-[#E4E1D9] first:border-t">
                <span className="text-[#5B6577] text-sm">{t.promotions.livingSurface}</span>
                <span className="font-sans font-medium text-base text-right">{house.size} {t.promotions.squareMeters}</span>
              </div>
              <div className="flex justify-between py-4 border-b border-[#E4E1D9]">
                <span className="text-[#5B6577] text-sm">{t.promotions.structure}</span>
                <span className="font-sans font-medium text-base text-right">{t.promotions.structureValue}</span>
              </div>
              <div className="flex justify-between py-4 border-b border-[#E4E1D9]">
                <span className="text-[#5B6577] text-sm">{t.promotions.certification}</span>
                <span className="font-sans font-medium text-base text-right">{t.promotions.certificationValue}</span>
              </div>
              <div className="flex justify-between py-4 border-b border-[#E4E1D9]">
                <span className="text-[#5B6577] text-sm">{t.promotions.deliveryLabel}</span>
                <span className="font-sans font-medium text-base text-right">{t.catalog.factoryDelivery}</span>
              </div>
              <p className="mt-7 text-[#5B6577] text-sm leading-relaxed">
                {model.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox / Fullscreen Image Viewer */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors z-50"
            aria-label="Close lightbox"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          {/* Lightbox Image */}
          <img 
            src={house.images[currentImageIndex]} 
            alt={`${model.name} - fullscreen view`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {/* Lightbox Navigation */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex(prev => prev === 0 ? house.images.length - 1 : prev - 1);
            }}
            className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
            aria-label="Previous image"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex(prev => prev === house.images.length - 1 ? 0 : prev + 1);
            }}
            className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
            aria-label="Next image"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          {/* Image Counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white font-mono text-sm">
            {currentImageIndex + 1} / {house.images.length}
          </div>
        </div>
      )}

      {/* Build Sequence */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="max-w-[600px] mb-13">
            <span className="font-mono text-xs tracking-[0.14em] uppercase text-[#2563EB] flex items-center gap-2 before:content-[''] before:w-4 before:h-[1px] before:bg-[#2563EB]">
              {t.promotions.process}
            </span>
            <h2 className="text-3xl font-medium mt-4 mb-3.5 tracking-tight text-[#0F172A]">{t.promotions.howItWorks}</h2>
            <p className="text-[#6B7280] text-base leading-relaxed">
              {t.promotions.processDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <span className="font-sans font-semibold text-2xl text-[#2563EB] mb-3.5 block">01</span>
              <h3 className="text-sm font-semibold mb-2 text-[#0F172A]">{t.promotions.reserve}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed m-0">{t.promotions.reserveDesc}</p>
            </div>
            <div className="relative lg:pl-7 lg:border-l lg:border-gray-200">
              <span className="font-sans font-semibold text-2xl text-[#2563EB] mb-3.5 block">02</span>
              <h3 className="text-sm font-semibold mb-2 text-[#0F172A]">{t.promotions.prepare}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed m-0">{t.promotions.prepareDesc}</p>
            </div>
            <div className="relative lg:pl-7 lg:border-l lg:border-gray-200">
              <span className="font-sans font-semibold text-2xl text-[#2563EB] mb-3.5 block">03</span>
              <h3 className="text-sm font-semibold mb-2 text-[#0F172A]">{t.promotions.deliver}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed m-0">{t.promotions.deliverDesc}</p>
            </div>
            <div className="relative lg:pl-7 lg:border-l lg:border-gray-200">
              <span className="font-sans font-semibold text-2xl text-[#2563EB] mb-3.5 block">04</span>
              <h3 className="text-sm font-semibold mb-2 text-[#0F172A]">{t.promotions.enjoy}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed m-0">{t.promotions.enjoyDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Price Section */}
      <section className="py-24">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="bg-[#101C2C] text-white rounded-sm overflow-hidden relative">
            {/* Top Accent Border */}
            <div className="h-1 bg-gradient-to-r from-[#A9824C] via-[#C9A26C] to-[#A9824C]"></div>
            
            <div className="py-16 px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              {/* Left Side: Pricing */}
              <div className="lg:col-span-3">
                <span className="font-mono text-xs tracking-[0.18em] uppercase text-[#A9824C] flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-[#A9824C]"></span>
                  {t.promotions.limitedOffer}
                </span>
                
                {/* Pricing Stack */}
                <div className="mt-8 flex items-end gap-6 flex-wrap">
                  <p className="text-lg text-white/40 line-through">{formatPrice(house.marketPrice)}</p>
                  <p className="font-sans font-bold text-[3.5rem] lg:text-[4rem] leading-none text-white">{formatPrice(house.price)}</p>
                  <span className="inline-flex items-center px-4 py-2 bg-[#A9824C]/15 border border-[#A9824C]/60 text-[#A9824C] font-mono text-xs tracking-[0.15em] rounded-sm">
                    -{house.discount}% {t.promotions.discount}
                  </span>
                </div>

                {/* Feature List - Premium Styling */}
                <ul className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10 p-0 list-none border-t border-white/10 pt-10">
                  <li className="flex flex-col gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#A9824C]/10 flex items-center justify-center mb-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A9824C" strokeWidth="2">
                        <path d="M5 12l5 5L20 7"/>
                      </svg>
                    </span>
                    <span className="text-sm text-white/90 font-medium">{t.promotions.fastDelivery}</span>
                    <span className="text-xs text-white/50">{t.promotions.deliveryWeeks}</span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#A9824C]/10 flex items-center justify-center mb-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A9824C" strokeWidth="2">
                        <path d="M5 12l5 5L20 7"/>
                      </svg>
                    </span>
                    <span className="text-sm text-white/90 font-medium">{t.promotions.warranty}</span>
                    <span className="text-xs text-white/50">{t.promotions.warrantyYears}</span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#A9824C]/10 flex items-center justify-center mb-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A9824C" strokeWidth="2">
                        <path d="M5 12l5 5L20 7"/>
                      </svg>
                    </span>
                    <span className="text-sm text-white/90 font-medium">{t.promotions.premiumQuality}</span>
                    <span className="text-xs text-white/50">{t.promotions.durableMaterials}</span>
                  </li>
                  <li className="flex flex-col gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#A9824C]/10 flex items-center justify-center mb-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A9824C" strokeWidth="2">
                        <path d="M5 12l5 5L20 7"/>
                      </svg>
                    </span>
                    <span className="text-sm text-white/90 font-medium">{t.promotions.turnkey}</span>
                    <span className="text-xs text-white/50">{t.promotions.readyToLive}</span>
                  </li>
                </ul>
              </div>

              {/* Right Side: CTA Buttons - Stacked Vertically */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <button 
                  onClick={() => setShowReservation(true)}
                  className="w-full inline-flex items-center justify-center gap-2.5 font-semibold text-sm bg-[#A9824C] text-white px-8 py-4 rounded-sm hover:bg-[#B9925C] transition-all shadow-lg shadow-[#A9824C]/20"
                >
                  {t.promotions.bookNow}
                  <ArrowRight size={16} />
                </button>
                <Link 
                  href={`/contact?quote=${house.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2.5 font-medium text-sm border-2 border-white/30 text-white px-8 py-4 rounded-sm hover:border-white hover:bg-white/5 transition-all"
                >
                  {t.promotions.requestQuote}
                </Link>
                <p className="text-center text-xs text-white/40 mt-2">{t.promotions.depositToReserve}</p>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-[#A9824C]/40 pointer-events-none"></div>
            <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-[#A9824C]/40 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Financing Section */}
      <section id="financing" className="py-24">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="max-w-[600px] mb-13">
            <span className="font-mono text-xs tracking-[0.14em] uppercase text-[#A9824C] flex items-center gap-2 before:content-[''] before:w-4 before:h-[1px] before:bg-[#A9824C]">
              {t.promotions.financing}
            </span>
            <h2 className="text-3xl font-medium mt-4 mb-3.5 tracking-tight">{t.promotions.accessibleMonthlyPayments}</h2>
            <p className="text-[#5B6577] text-base leading-relaxed">
              {t.promotions.financingDescription}
            </p>
          </div>
          <div className="border-t border-[#E4E1D9]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 pb-4 border-b border-[#E4E1D9] font-mono text-[11.5px] uppercase tracking-wider text-[#8891A0]">
              <span>{t.promotions.formula}</span>
              <span>{t.promotions.monthlyPayment}</span>
              <span>{t.promotions.duration}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-[#E4E1D9] items-baseline">
              <span className="font-sans font-semibold text-xl">{t.promotions.classic}</span>
              <span className="font-sans font-semibold text-xl">{formatPrice(house.monthlyPayment)}<span className="font-sans text-xs text-[#5B6577]">/{t.promotions.months}</span></span>
              <span className="text-[#5B6577] text-sm">{house.financingMonths} {t.promotions.months}</span>
            </div>
            {(house.extendedMonthlyPayment || house.ecoMonthlyPayment) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-[#E4E1D9] items-baseline">
                <span className="font-sans font-semibold text-xl">{t.promotions.longterm}</span>
                <span className="font-sans font-semibold text-xl">{formatPrice(house.ecoMonthlyPayment || Math.round(house.monthlyPayment * 0.33))}<span className="font-sans text-xs text-[#5B6577]">/{t.promotions.months}</span></span>
                <span className="text-[#5B6577] text-sm">{house.ecoMonths || 480} {t.promotions.months}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Closing Banner */}
      <section className="py-24 pt-0">
        <div className="max-w-[1180px] mx-auto px-8 relative h-[520px] rounded-sm overflow-hidden">
          <img 
            src={house.images[0] || house.image} 
            alt={model.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(16,28,44,0.15)] to-[rgba(16,28,44,0.82)]"></div>
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-14 text-white">
            <h2 className="text-[clamp(1.5rem,4vw,2.125rem)] font-medium max-w-[560px] mb-5.5">
              {t.promotions.readyToStart}
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2.5 font-medium text-sm bg-white text-[#101C2C] px-7 py-3.5 rounded-sm hover:bg-gray-100 transition-all"
              >
                {t.promotions.contactUs}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-11">
        <div className="max-w-[1180px] mx-auto px-8 flex flex-wrap gap-12 pt-11 mt-11 border-t border-[#E4E1D9]">
          <div className="font-mono text-xs text-[#5B6577] tracking-wider">
            <b className="text-[#101C2C] block font-sans text-base mb-1 font-medium">{t.promotions.securePayment}</b>
            {t.promotions.fullyRefundableDeposit}
          </div>
          <div className="font-mono text-xs text-[#5B6577] tracking-wider">
            <b className="text-[#101C2C] block font-sans text-base mb-1 font-medium">{t.promotions.warranty10Years}</b>
            {t.promotions.frenchBuilder}
          </div>
          <div className="font-mono text-xs text-[#5B6577] tracking-wider">
            <b className="text-[#101C2C] block font-sans text-base mb-1 font-medium">{t.promotions.fastDeliveryShort}</b>
            {t.promotions.weeksOnly}
          </div>
        </div>
      </section>

      {showReservation && <ReservationModal house={house} onClose={() => setShowReservation(false)} />}
      
      <Footer />
    </main>
  );
}