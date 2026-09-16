"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type CategoryItem = {
  id: string
  name: string
  handle: string
  parent_category?: unknown
}

type FilterDrawerProps = {
  isOpen: boolean
  onClose: () => void
  type: "filters" | "sort"
  categories?: CategoryItem[]
  selectedCategory?: string
  sortBy?: SortOptions
}

const SORT_OPTIONS: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Nouveautés" },
  { value: "price_asc", label: "Prix : croissant" },
  { value: "price_desc", label: "Prix : décroissant" },
]

const FilterDrawer = ({
  isOpen,
  onClose,
  type,
  categories = [],
  selectedCategory,
  sortBy = "created_at",
}: FilterDrawerProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "")
  const [priceError, setPriceError] = useState("")

  useEffect(() => {
    setMinPrice(searchParams.get("min_price") || "")
    setMaxPrice(searchParams.get("max_price") || "")
    setPriceError("")
  }, [searchParams])

  const handlePriceApply = () => {
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

    if (minimum === undefined) params.delete("min_price")
    else params.set("min_price", minimum.toString())

    if (maximum === undefined) params.delete("max_price")
    else params.set("max_price", maximum.toString())

    params.delete("page")
    setPriceError("")
    router.push("?" + params.toString())
    onClose()
  }

  const handleSortChange = (newSortBy: SortOptions) => {
    const params = new URLSearchParams(searchParams)
    params.set("sortBy", newSortBy)
    params.delete("page") // Reset to page 1 when sorting changes
    router.push(`?${params.toString()}`)
    onClose()
  }

  const handleCategoryChange = (categoryHandle: string | undefined) => {
    const params = new URLSearchParams(searchParams)
    if (categoryHandle) {
      params.set("category", categoryHandle)
    } else {
      params.delete("category")
    }
    params.delete("page") // Reset to page 1 when category changes
    router.push(`?${params.toString()}`)
    onClose()
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 transition-opacity" />
        </Transition.Child>

        {/* Slide-up panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-x-0 bottom-0 flex max-h-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-black rounded-t-2xl shadow-xl">
                  {/* Handle for drag indicator */}
                  <div className="sticky top-0 z-10 flex justify-center py-3 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800">
                    <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                  </div>

                  {/* Content */}
                  <div className="px-5 py-4 pb-10">
                    {type === "sort" ? (
                      <div className="space-y-2">
                        <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                          Trier par
                        </Dialog.Title>
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-colors ${
                              sortBy === option.value
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            <span className="font-medium">{option.label}</span>
                            {sortBy === option.value && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                          Filtres
                        </Dialog.Title>

                        <div className="border-b border-gray-100 pb-6 dark:border-gray-800">
                          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Fourchette de prix
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            <label className="text-xs text-gray-500 dark:text-gray-400">
                              Minimum
                              <span className="relative mt-1 block">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
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
                                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-7 pr-2 text-sm text-gray-900 outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-black dark:text-white"
                                />
                              </span>
                            </label>
                            <label className="text-xs text-gray-500 dark:text-gray-400">
                              Maximum
                              <span className="relative mt-1 block">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
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
                                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-7 pr-2 text-sm text-gray-900 outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-black dark:text-white"
                                />
                              </span>
                            </label>
                          </div>
                          {priceError && (
                            <p className="mt-2 text-xs text-red-600">{priceError}</p>
                          )}
                          <button
                            type="button"
                            onClick={handlePriceApply}
                            className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                          >
                            Appliquer le prix
                          </button>
                        </div>

                        {/* Catégories */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                            Catégories
                          </h3>
                          <div className="space-y-1">
                            <button
                              onClick={() => handleCategoryChange(undefined)}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors ${
                                !selectedCategory
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              <span className="font-medium">Tous les produits</span>
                              {!selectedCategory && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                            {categories.map((category) => (
                              <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.handle)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors ${
                                  selectedCategory === category.handle
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                <span className="font-medium">{category.name}</span>
                                {selectedCategory === category.handle && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default FilterDrawer
