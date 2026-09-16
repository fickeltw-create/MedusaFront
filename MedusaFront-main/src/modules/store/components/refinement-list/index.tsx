"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { SortOptions } from "./sort-products"

type CategoryItem = {
  id: string
  name: string
  handle: string
  parent_category?: unknown
}

type RefinementListProps = {
  sortBy: SortOptions
  categories?: CategoryItem[]
  selectedCategory?: string
  search?: boolean
  "data-testid"?: string
}

const FilterChevron = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 20 20"
    aria-hidden="true"
    className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="m5 7 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Checkmark = () => (
  <svg
    viewBox="0 0 16 16"
    aria-hidden="true"
    className="h-3 w-3"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
  >
    <path d="m3 8 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const RefinementList = ({
  categories = [],
  selectedCategory,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [categoriesOpen, setCategoriesOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "")
  const [priceError, setPriceError] = useState("")

  useEffect(() => {
    setMinPrice(searchParams.get("min_price") || "")
    setMaxPrice(searchParams.get("max_price") || "")
    setPriceError("")
  }, [searchParams])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)

      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }

      if (name === "category") {
        params.delete("page")
      }

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}${query ? `?${query}` : ""}`)
  }

  const applyFilters = () => {
    const minimum = minPrice.trim() ? Number(minPrice) : undefined
    const maximum = maxPrice.trim() ? Number(maxPrice) : undefined

    if (
      (minimum !== undefined && (!Number.isFinite(minimum) || minimum < 0)) ||
      (maximum !== undefined && (!Number.isFinite(maximum) || maximum < 0))
    ) {
      setPriceError("Saisissez des prix valides supérieurs ou égaux à 0.")
      return
    }

    if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
      setPriceError("Le prix minimum ne peut pas être supérieur au prix maximum.")
      return
    }

    const params = new URLSearchParams(searchParams)

    if (minimum === undefined) {
      params.delete("min_price")
    } else {
      params.set("min_price", minimum.toString())
    }

    if (maximum === undefined) {
      params.delete("max_price")
    } else {
      params.set("max_price", maximum.toString())
    }

    params.delete("page")
    setPriceError("")
    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ""}`)
  }

  const resetFilters = () => router.push(pathname)

  const renderCategoryButton = (value: string, label: string, key: string) => {
    const isActive = selectedCategory === value || (!selectedCategory && value === "")

    return (
      <button
        key={key}
        type="button"
        onClick={() => setQueryParams("category", value)}
        className="flex w-full items-center gap-3 py-1.5 text-left text-sm text-ui-fg-base"
      >
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border ${
            isActive
              ? "border-ui-fg-base bg-ui-fg-base text-ui-bg-base"
              : "border-ui-border-strong bg-ui-bg-base"
          }`}
        >
          {isActive && <Checkmark />}
        </span>
        <span className="min-w-0 flex-1 leading-5">{label}</span>
      </button>
    )
  }

  return (
    <div
      className="w-full overflow-hidden rounded-md border border-ui-border-base bg-ui-bg-base"
      data-testid={dataTestId}
    >
      <div className="flex items-center justify-between border-b border-ui-border-base px-4 py-4">
        <h2 className="text-sm font-semibold text-ui-fg-base">Filtres</h2>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-semibold text-ui-fg-base hover:text-ui-fg-subtle"
        >
          Tout réinitialiser
        </button>
      </div>

      <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
        <section className="border-b border-ui-border-base px-4 py-4">
          <button
            type="button"
            onClick={() => setPriceOpen((open) => !open)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-sm font-semibold text-ui-fg-base">Fourchette de prix</span>
            <FilterChevron open={priceOpen} />
          </button>
          {priceOpen && (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-ui-fg-subtle">
                  Minimum
                  <span className="relative mt-1 block">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-ui-fg-muted">
                      &euro;
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={minPrice}
                      onChange={(event) => setMinPrice(event.target.value)}
                      placeholder="0"
                      className="h-9 w-full rounded-md border border-ui-border-base bg-ui-bg-base pl-6 pr-2 text-xs text-ui-fg-base outline-none focus:border-ui-border-interactive"
                    />
                  </span>
                </label>
                <label className="text-xs text-ui-fg-subtle">
                  Maximum
                  <span className="relative mt-1 block">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-ui-fg-muted">
                      &euro;
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                      placeholder="5000+"
                      className="h-9 w-full rounded-md border border-ui-border-base bg-ui-bg-base pl-6 pr-2 text-xs text-ui-fg-base outline-none focus:border-ui-border-interactive"
                    />
                  </span>
                </label>
              </div>
              {priceError && <p className="mt-2 text-xs text-ui-fg-error">{priceError}</p>}
            </div>
          )}
        </section>

        <section className="px-4 py-4">
          <button
            type="button"
            onClick={() => setCategoriesOpen((open) => !open)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-sm font-semibold text-ui-fg-base">Catégories</span>
            <FilterChevron open={categoriesOpen} />
          </button>
          {categoriesOpen && (
            <div className="mt-4 flex flex-col gap-1" data-testid="category-filters">
              {renderCategoryButton("", "Tous les produits", "all")}
              {categories.map((category) =>
                renderCategoryButton(category.handle, category.name, category.id)
              )}
              {categories.length === 0 && (
                <p className="py-1 text-xs text-ui-fg-muted">Aucune catégorie disponible</p>
              )}
            </div>
          )}
        </section>


      </div>

      <div className="space-y-2 border-t border-ui-border-base p-4">
        <button
          type="button"
          onClick={applyFilters}
          className="w-full rounded-md bg-ui-fg-base px-3 py-3 text-xs font-semibold text-ui-bg-base transition-opacity hover:opacity-90"
        >
          Appliquer les filtres
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="w-full rounded-md border border-ui-border-base bg-ui-bg-base px-3 py-3 text-xs font-semibold text-ui-fg-base transition-colors hover:bg-ui-bg-field-hover"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  )
}

export default RefinementList
