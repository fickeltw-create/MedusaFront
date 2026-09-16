"use client"

import { useState, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { useRouter, useSearchParams } from "next/navigation"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type CategoryItem = {
  id: string
  name: string
  handle: string
  parent_category?: unknown
}

type MobileFiltersProps = {
  sortBy: SortOptions
  categories: CategoryItem[]
  selectedCategory?: CategoryItem
  children: React.ReactNode
}

const SORT_OPTIONS: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
]

export default function MobileFilters({
  sortBy,
  categories,
  selectedCategory,
  children,
}: MobileFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const pageTitle = selectedCategory?.name || "All Products"

  const handleSortChange = (newSort: SortOptions) => {
    const params = new URLSearchParams(searchParams)
    params.set("sortBy", newSort)
    params.delete("page")
    router.push(`?${params.toString()}`)
    setSortOpen(false)
  }

  const handleCategoryChange = (handle?: string) => {
    const params = new URLSearchParams(searchParams)
    if (handle) {
      params.set("category", handle)
    } else {
      params.delete("category")
    }
    params.delete("page")
    router.push(`?${params.toString()}`)
    setFilterOpen(false)
  }

  const categoryButtons = [
    { value: "", label: "All" },
    ...categories.map((cat) => ({
      value: cat.handle,
      label: cat.name,
    })),
  ]

  return (
    <div className="relative">
      {/* Nike/Adidas Style Mobile Toolbar - Only visible on mobile */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 lg:hidden shadow-sm">
        <div className="flex items-center justify-between h-16 px-5">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-3">
            {/* Sort Button */}
            <button
              onClick={() => setSortOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Sort
            </button>
            {/* Filter Button */}
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Add padding for mobile toolbar */}
      <main className="pt-20 lg:pt-0 px-4 lg:px-0">
        {children}
      </main>

      {/* Sort Drawer - Slide up from bottom like Nike app */}
      <Transition appear show={sortOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSortOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 flex items-end justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
              >
                <Dialog.Panel className="w-full max-w-xl bg-white dark:bg-black rounded-t-[32px] shadow-2xl">
                  {/* Drag handle */}
                  <div className="flex justify-center pt-4 pb-2">
                    <div className="w-14 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                  </div>
                  
                  <Dialog.Title className="text-2xl font-bold px-6 py-4 border-b border-gray-100 dark:border-gray-900">
                    Sort by
                  </Dialog.Title>

                  <div className="px-6 py-8 space-y-4">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`w-full flex items-center justify-between p-5 rounded-2xl text-left transition-all ${
                          sortBy === option.value
                            ? "bg-black dark:bg-white text-white dark:text-black"
                            : "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
                        }`}
                      >
                        <span className="text-lg font-semibold">{option.label}</span>
                        {sortBy === option.value && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="px-6 pb-10">
                    <button
                      onClick={() => setSortOpen(false)}
                      className="w-full py-4 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-2xl font-semibold text-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Filters Drawer - Categories */}
      <Transition appear show={filterOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setFilterOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 flex items-end justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
              >
                <Dialog.Panel className="w-full max-w-xl bg-white dark:bg-black rounded-t-[32px] shadow-2xl">
                  {/* Drag handle */}
                  <div className="flex justify-center pt-4 pb-2">
                    <div className="w-14 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                  </div>
                  
                  <Dialog.Title className="text-2xl font-bold px-6 py-4 border-b border-gray-100 dark:border-gray-900">
                    Filter by Category
                  </Dialog.Title>

                  <div className="px-6 py-8 space-y-4 max-h-[50vh] overflow-y-auto">
                    {categoryButtons.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleCategoryChange(option.value)}
                        className={`w-full flex items-center justify-between p-5 rounded-2xl text-left transition-all ${
                          (selectedCategory?.handle === option.value) || (!selectedCategory && option.value === "")
                            ? "bg-black dark:bg-white text-white dark:text-black"
                            : "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
                        }`}
                      >
                        <span className="text-lg font-semibold">{option.label}</span>
                        {(selectedCategory?.handle === option.value || (!selectedCategory && option.value === "")) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="px-6 pb-10">
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="w-full py-4 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-2xl font-semibold text-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}