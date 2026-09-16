'use client';

import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function ImageLightbox({ 
  images, 
  initialIndex, 
  isOpen, 
  onClose,
  title = 'Image gallery'
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, onClose]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close gallery"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToPrevious();
        }}
        className="absolute left-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        className="absolute right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Main image */}
      <div 
        className="relative max-h-[85vh] max-w-[90vw] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        ) : (
          <div className="h-96 w-96 bg-gray-800 rounded-2xl flex items-center justify-center">
            <span className="text-6xl">📦</span>
          </div>
        )}
      </div>

      {/* Thumbnail strip at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-3 bg-black/50 rounded-2xl backdrop-blur-sm overflow-x-auto max-w-[90vw]">
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
              currentIndex === idx 
                ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' 
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            {image ? (
              <img
                src={image}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-700" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Create a hook to easily use the lightbox
export function useImageLightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    currentIndex,
    openLightbox,
    closeLightbox,
  };
}