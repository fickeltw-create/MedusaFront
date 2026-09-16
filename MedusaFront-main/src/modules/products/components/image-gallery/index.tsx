"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"
import AddToCartButton from "@modules/products/components/product-preview/add-to-cart-button"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  variantId?: string
}

const ImageGallery = ({ images, variantId }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const safeImages = images?.length ? images : [{ id: "placeholder", url: "" } as HttpTypes.StoreProductImage]
  const activeImage = safeImages[activeIndex] || safeImages[0]

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + safeImages.length) % safeImages.length)
  }

  return (
    <div className="w-full">
      <div className="group relative aspect-square overflow-hidden rounded-xl border border-ui-border-base bg-ui-bg-subtle">
        {activeImage.url ? (
          <Image
            src={activeImage.url}
            priority
            className="object-contain object-center"
            alt="Product image"
            fill
            sizes="(max-width: 992px) 100vw, 60vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ui-fg-muted">No image available</div>
        )}
        <AddToCartButton variantId={variantId} />
        {safeImages.length > 1 && (
          <>
            <button type="button" onClick={() => move(-1)} className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-ui-border-base bg-white/95 text-lg opacity-0 shadow-sm transition-opacity group-hover:opacity-100" aria-label="Previous image">&#8249;</button>
            <button type="button" onClick={() => move(1)} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-ui-border-base bg-white/95 text-lg opacity-0 shadow-sm transition-opacity group-hover:opacity-100" aria-label="Next image">&#8250;</button>
          </>
        )}
      </div>
      {safeImages.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 small:grid-cols-5">
          {safeImages.map((image, index) => (
            <button
              type="button"
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border bg-ui-bg-subtle ${index === activeIndex ? "border-ui-fg-base" : "border-ui-border-base"}`}
              aria-label={`View product image ${index + 1}`}
            >
              {image.url && <Image src={image.url} alt="" fill className="object-cover" sizes="120px" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery