'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

// Your videos are in public/Banner/ - these paths are 100% correct
const bannerVideos = [
  '/Banner/1.mp4',
  '/Banner/2.mp4',
  '/Banner/3.mp4',
  '/Banner/4.mp4',
  '/Banner/5.mp4'
];

export default function HeroSection() {
  const { t } = useI18n();
  // Start ALWAYS on first video (index 0), as requested - only defined once now!
  const [loaded, setLoaded] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Videos are 5 seconds long - switch EXACTLY every 5000ms
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideo((prev) => (prev + 1) % bannerVideos.length);
        setIsTransitioning(false);
      }, 100);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentVideo((prev) => (prev - 1 + bannerVideos.length) % bannerVideos.length);
      setIsTransitioning(false);
    }, 100);
  };

  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentVideo((prev) => (prev + 1) % bannerVideos.length);
      setIsTransitioning(false);
    }, 100);
  };

  return (
    <section className="relative min-h-screen pb-24 flex items-center justify-center overflow-hidden">
      {/* Single active video with DOM reset to always start from beginning - eliminates jump cuts */}
      <video
        key={currentVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        loop={false}
        onLoadedMetadata={(e) => {
          // Always restart video from timestamp 0 when it loads
          e.currentTarget.currentTime = 0;
          e.currentTarget.play().catch(err => {
            console.log("Video play prevented (this is normal for background media):", err);
          });
        }}
        onError={(e) => console.log("Video error:", bannerVideos[currentVideo], e)}
        className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 ease-in-out opacity-100"
      >
        <source src={bannerVideos[currentVideo]} type="video/mp4" />
      </video>
      
      {/* Previous video stays in DOM to fade out - creates smooth crossfade */}
      {currentVideo > 0 && (
        <video
          key={currentVideo - 1}
          autoPlay
          muted
          playsInline
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ease-in-out opacity-0"
        >
          <source src={bannerVideos[currentVideo - 1]} type="video/mp4" />
        </video>
      )}
      {/* Edge case: when looping back to first video, fade out last video */}
      {currentVideo === 0 && (
        <video
          key={bannerVideos.length - 1}
          autoPlay
          muted
          playsInline
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ease-in-out opacity-0"
        >
          <source src={bannerVideos[bannerVideos.length - 1]} type="video/mp4" />
        </video>
      )}
      
      {/* Fallback background - only shows if videos fail, sent to back with -z-10 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
        }}
      />

      {/* Dark overlay to ensure smooth black transitions between videos */}
      <div className="absolute inset-0 bg-black/20 z-5" />

      {/* Animated particles / lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/3 right-1/3 w-px h-24 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
        <div className="absolute bottom-1/4 left-1/3 w-24 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* Content - Added pt-28 on desktop to avoid menu overlap */}
      <div className="relative container-wide z-10 text-center pt-24 md:pt-28">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" />
          <span className="text-white/90 text-xs font-medium tracking-widest uppercase">{t.hero.badge}</span>
        </div>

        {/* Headline - reduced size for better fit */}
        <h1
          className={`font-syne font-extrabold text-3xl md:text-5xl lg:text-5xl text-white leading-[1.05] tracking-tight mb-4 transition-all duration-700 delay-100 max-w-4xl mx-auto ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {t.hero.headline}
        </h1>

        {/* Subheadline - smaller text */}
        <p
          className={`text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {t.hero.subtitle}
        </p>

        {/* Navigation arrows */}
        <div className="flex items-center justify-center gap-4 z-20 mb-6">
          <button
            onClick={goToPrevious}
            className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          
          {/* Video indicators */}
          <div className="flex items-center gap-2">
            {bannerVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentVideo(index);
                    setIsTransitioning(false);
                  }, 100);
                }}
                className={`w-2 h-2 rounded-full transition-all ${index === currentVideo ? 'bg-white w-5' : 'bg-white/40'}`}
              />
            ))}
          </div>
          
          <button
            onClick={goToNext}
            className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* CTA Buttons - reduced size */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <Link
            href="/catalogue"
            className="flex items-center gap-1.5 bg-[#2563EB] text-white px-5 py-2.5 rounded-lg font-semibold text-xs hover:bg-[#1D4ED8] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/20 group"
          >
            {t.hero.cta1}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 rounded-lg font-semibold text-xs hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            {t.hero.cta2}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <ChevronDown size={20} className="text-white/40" />
      </div>

      {/* Diagonal bottom edge - taller on mobile for extra space */}
      <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-20 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 40%, 0 100%)' }} />
    </section>
  );
}