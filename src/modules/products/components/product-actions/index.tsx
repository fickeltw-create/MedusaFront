"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (variantOptions: HttpTypes.StoreProductVariant["options"]) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({ product, disabled }: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countryCode = useParams().countryCode as string
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [quantity, setQuantité] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  useEffect(() => {
    if (product.variants?.length === 1) {
      setOptions(optionsAsKeymap(product.variants[0].options) ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants?.length) return
    return product.variants.find((variant) => isEqual(optionsAsKeymap(variant.options), options))
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((previous) => ({ ...previous, [optionId]: value }))
  }

  const isValidVariant = useMemo(() => product.variants?.some((variant) => isEqual(optionsAsKeymap(variant.options), options)), [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null
    if (params.get("v_id") === value) return
    if (value) params.set("v_id", value)
    else params.delete("v_id")
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`)
  }, [selectedVariant, isValidVariant, pathname, router, searchParams])

  const inStock = Boolean(selectedVariant)

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null
    setIsAdding(true)
    setAddError(null)
    try {
      await addToCart({ variantId: selectedVariant.id, quantity, countryCode })
      router.refresh()
    } catch (error) {
      setAddError(error instanceof Error ? error.message : "Impossible d'ajouter le produit au panier")
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!selectedVariant?.id) return null
    setIsAdding(true)
    setAddError(null)
    try {
      await addToCart({ variantId: selectedVariant.id, quantity, countryCode })
      router.push(`/${countryCode}/checkout?step=address`)
    } catch (error) {
      setAddError(error instanceof Error ? error.message : "Impossible d'ajouter le produit au panier")
      setIsAdding(false)
    }
  }

  const canDecrease = quantity > 1

  return (
    <div className="flex flex-col gap-6" ref={actionsRef}>

      <p className="max-w-2xl whitespace-pre-line text-sm leading-6 text-ui-fg-subtle">
        {product.description || "Un produit soigneusement sélectionné pour votre maison modulaire."}
      </p>
      <ProductPrice product={product} variant={selectedVariant} />
      <div className="flex items-center gap-2 text-sm text-green-700">
        <span className="h-2 w-2 rounded-full bg-green-600" />
        {selectedVariant ? (inStock ? "En stock" : "Précommande") : "Sélectionnez une option"}
      </div>


      {(product.variants?.length ?? 0) > 1 && (
        <div className="flex flex-col gap-5 border-t border-ui-border-base pt-5">
          {(product.options || []).map((option) => (
            <OptionSelect
              key={option.id}
              option={option}
              current={options[option.id]}
              updateOption={setOptionValue}
              title={option.title ?? ""}
              data-testid="product-options"
              disabled={!!disabled || isAdding}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ui-fg-base">Quantité</span>
        <div className="flex items-center border border-ui-border-base">
          <button type="button" className="h-10 w-10 text-lg disabled:cursor-not-allowed disabled:text-ui-fg-muted" onClick={() => setQuantité((value) => Math.max(1, value - 1))} disabled={!canDecrease || isAdding} aria-label="Diminuer la quantité">-</button>
          <span className="flex h-10 w-10 items-center justify-center border-x border-ui-border-base text-sm">{quantity}</span>
          <button type="button" className="h-10 w-10 text-lg" onClick={() => setQuantité((value) => Math.min(1000, value + 1))} disabled={isAdding || quantity >= 1000} aria-label="Augmenter la quantité">+</button>
        </div>
      </div>
      {addError && <p className="text-sm text-red-600">{addError}</p>}

      <Button
        onClick={handleAddToCart}
        disabled={!inStock || !selectedVariant || !!disabled || isAdding || !isValidVariant}
        variant="primary"
        className="h-12 w-full rounded-md text-sm font-medium"
        isLoading={isAdding}
        data-testid="add-product-button"
      >
        {!selectedVariant ? "Sélectionnez une option" : !inStock || !isValidVariant ? "Rupture de stock" : "Ajouter au panier"}
      </Button>

      <Button
        onClick={handleBuyNow}
        disabled={!inStock || !selectedVariant || !!disabled || isAdding || !isValidVariant}
        variant="secondary"
        className="h-12 w-full rounded-md text-sm font-medium"
        isLoading={isAdding}
      >
        Payer maintenant
      </Button>

      <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOptions={setOptionValue}
        inStock={inStock}
        handleAddToCart={handleAddToCart}
        handleBuyNow={handleBuyNow}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={!!disabled || isAdding}
      />
    </div>
  )
}