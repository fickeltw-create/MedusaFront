import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) return notFound()

  return (
    <>
      <main className="content-container py-6 small:py-10" data-testid="product-container">
        <nav className="mb-8 flex items-center gap-2 text-xs text-ui-fg-muted" aria-label="Fil d'Ariane">
          <span>Accueil</span>
          <span>/</span>
          {product.collection?.title && <><span>{product.collection.title}</span><span>/</span></>}
          <span className="max-w-[260px] truncate text-ui-fg-base">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(300px,0.78fr)] md:gap-10">
          <div className="md:sticky md:top-24">
            <ImageGallery images={images} variantId={product.variants?.[0]?.id} />
          </div>

          <div className="flex min-w-0 flex-col gap-7">
            <ProductInfo product={product} />
            <ProductOnboardingCta />
            <Suspense
              fallback={<ProductActions disabled={true} product={product} region={region} />}
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
            <div className="grid grid-cols-3 gap-3 border-y border-ui-border-base py-5 text-xs text-ui-fg-subtle">
              <div><strong className="block text-ui-fg-base">Livraison offerte</strong><span>Pour toute commande supérieure à 500 EUR</span></div>
              <div><strong className="block text-ui-fg-base">Retours sous 30 jours</strong><span>Retours et remboursements faciles</span></div>
              <div><strong className="block text-ui-fg-base">Paiement sécurisé</strong><span>Paiement 100 % sécurisé</span></div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-ui-border-base pt-2 small:mt-16">
          <ProductTabs product={product} />
        </div>
      </main>

      <div className="content-container my-16 small:my-24" data-testid="related-products-container">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate