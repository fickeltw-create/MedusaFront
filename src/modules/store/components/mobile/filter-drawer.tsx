"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
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
  { value: "created_at", label: "Latest Arrivals" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
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
                          Sort by
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
                          Filters
                        </Dialog.Title>

                        {/* Categories */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                            Categories
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
                              <span className="font-medium">All Products</span>
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