"use client"

import { addToCart } from "@lib/data/cart"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import type { MouseEvent } from "react"

type AddToCartButtonProps = {
  variantId?: string
  disabled?: boolean
}

const CartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
  >
    <path d="M3.5 4h2l1.8 10.1a1.8 1.8 0 0 0 1.8 1.5h8.7a1.8 1.8 0 0 0 1.7-1.3L21 7H6.2" />
    <circle cx="10" cy="19" r="1.2" />
    <circle cx="18" cy="19" r="1.2" />
  </svg>
)

const CheckIcon = () => (
  <svg
    viewBox="0 0 20 20"
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
  >
    <path d="m4 10 4 4 8-8" />
  </svg>
)

export default function AddToCartButton({
  variantId,
  disabled = false,
}: AddToCartButtonProps) {
  const router = useRouter()
  const params = useParams<{ countryCode?: string }>()
  const [isAdding, setIsAdding] = useState(false)
  const [status, setStatus] = useState<"idle" | "added" | "error">("idle")

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!variantId || disabled || isAdding) {
      return
    }

    setIsAdding(true)
    setStatus("idle")

    try {
      await addToCart({
        variantId,
        quantity: 1,
        countryCode: params.countryCode || "be",
      })
      setStatus("added")
      router.refresh()
    } catch {
      setStatus("error")
    } finally {
      setIsAdding(false)
    }
  }

  const label =
    status === "added"
      ? "Ajouté au panier"
      : status === "error"
        ? "Impossible d'ajouter au panier"
        : "Ajouter au panier"

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!variantId || disabled || isAdding}
      aria-label={label}
      title={label}
      className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-ui-border-base bg-white text-ui-fg-base shadow-sm transition-colors hover:bg-ui-bg-subtle disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isAdding ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-ui-fg-muted border-t-ui-fg-base"
          aria-hidden="true"
        />
      ) : status === "added" ? (
        <CheckIcon />
      ) : (
        <CartIcon />
      )}
      <span className="sr-only">{label}</span>
    </button>
  )
}
