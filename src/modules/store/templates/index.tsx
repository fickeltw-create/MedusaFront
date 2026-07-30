import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreClientWrapper from "@modules/store/components/mobile/store-client-wrapper"

import PaginatedProducts from "./paginated-products"

type CategoryItem = {
  id: string
  name: string
  handle: string
  parent_category?: unknown
}

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  categories = [],
  selectedCategory,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categories?: CategoryItem[]
  selectedCategory?: CategoryItem
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const title = selectedCategory?.name || "All products"

  return (
    <StoreClientWrapper
      sortBy={sort}
      categories={categories}
      selectedCategory={selectedCategory}
    >
      <div
        className="flex flex-col lg:flex-row py-6 content-container"
        data-testid="category-container"
      >
        <div className="hidden lg:block lg:w-[240px] lg:flex lg:flex-col lg:items-center lg:pr-6">
          <RefinementList
            sortBy={sort}
            categories={categories}
            selectedCategory={selectedCategory?.handle}
            data-testid="sort-by-container"
          />
        </div>
        <div className="w-full">
           <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={selectedCategory?.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </StoreClientWrapper>
  )
}

export default StoreTemplate