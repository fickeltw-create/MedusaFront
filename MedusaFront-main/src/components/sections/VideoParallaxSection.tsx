'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';

export default function VideoParallaxSection() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Observer pour détecter quand la section entre dans la vue
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Lancer la vidéo quand la section est visible
          if (videoRef.current) {
            videoRef.current.play().catch(err => console.log("Lecture automatique bloquée:", err));
          }
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Effet parallaxe sur le scroll
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionTop = rect.top;
        const windowHeight = window.innerHeight;
        
        // Calculer la position de défilement pour l'effet parallaxe
        if (rect.top < windowHeight && rect.bottom > 0) {
          const scrolled = (windowHeight - sectionTop) / (windowHeight + rect.height);
          setScrollY(scrolled * 100); // Déplacement vertical de 100px max
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative h-[85vh] min-h-[700px] overflow-hidden bg-white"
    >
      {/* Subtle dark overlay for text readability - z-index between video and text */}
      <div 
        className={`absolute inset-0 z-10 bg-black/25 transition-opacity duration-1500 pointer-events-none ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Responsive top white fade gradient */}
      <div 
        className="absolute top-0 left-0 right-0 h-[120px] md:h-[140px] z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 15%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0) 100%)'
        }}
      />

      {/* Responsive bottom white fade gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[150px] md:h-[180px] z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 15%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0) 100%)'
        }}
      />

      {/* Mobile-optimized gradients that override for smaller screens */}
      <div className="sm:hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-[80px] z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 15%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0) 100%)'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 h-[100px] z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 15%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0) 100%)'
          }}
        />
      </div>

      {/* Full-screen video container with object-fit: cover and centered positioning */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: 'transform 0.1s linear'
        }}
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/Video/Modura cahier des charges.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>

      {/* Contenu textuel près du haut pour meilleur positionnement */}
      <div className="relative z-20 h-full flex flex-col items-center justify-start pt-12 text-center px-6">
        <div 
          className={`transition-all duration-1000 transform ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          <h2 className="font-syne font-bold text-4xl md:text-6xl text-white mb-6 drop-shadow-lg">
            {t.videoSection?.title || "Comment ça marche ?"}
          </h2>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-medium drop-shadow">
            {t.videoSection?.subtitle || "Découvrez comment votre projet de maison modulaire va prendre forme"}
          </p>
        </div>
      </div>

      {/* Indicateur de scroll adapté au fond blanc */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-gray-400/70 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-gray-600/80 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}