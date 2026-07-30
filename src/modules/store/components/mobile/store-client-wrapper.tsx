"use client"

import { useState, cloneElement, Children } from "react"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import MobileActionButtons from "./mobile-toolbar"
import FilterDrawer from "./filter-drawer"

type CategoryItem = {
  id: string
  name: string
  handle: string
  parent_category?: unknown
}

type StoreClientWrapperProps = {
  sortBy: SortOptions
  categories: CategoryItem[]
  selectedCategory?: CategoryItem
  children: React.ReactNode
}

const StoreClientWrapper = ({
  sortBy,
  categories,
  selectedCategory,
  children,
}: StoreClientWrapperProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const title = selectedCategory?.name || "All Products"

  return (
    <div className="relative">
      {/* Mobile Action Buttons - only visible on small screens */}
      <MobileActionButtons
        title={title}
        onOpenFilters={() => setIsFilterOpen(true)}
        onOpenSort={() => setIsSortOpen(true)}
      />

      {/* Main content */}
      <div>
        {children}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        type="filters"
        categories={categories}
        selectedCategory={selectedCategory?.handle}
        sortBy={sortBy}
      />

      {/* Sort Drawer */}
      <FilterDrawer
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        type="sort"
        sortBy={sortBy}
      />
    </div>
  )
}

export default StoreClientWrapper