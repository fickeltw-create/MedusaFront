import { Suspense } from "react"

import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import StoreClientWrapper from "@modules/store/components/mobile/store-client-wrapper"
import StoreToolbar from "@modules/store/components/store-toolbar"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"

type CategoryItem = {
  id: string
  name: string
  handle: string
  parent_category?: unknown
}

const StoreTemplate = async ({
  sortBy,
  page,
  view = "grid",
  minPrice,
  maxPrice,
  countryCode,
  categories = [],
  selectedCategory,
}: {
  sortBy?: SortOptions
  page?: string
  view?: "grid" | "list"
  minPrice?: string
  maxPrice?: string
  countryCode: string
  categories?: CategoryItem[]
  selectedCategory?: CategoryItem
}) => {
  const pageNumber = page ? parseInt(page, 10) : 1
  const sort = sortBy || "created_at"
  const title = selectedCategory?.name || "Boutique"
  const countQuery: HttpTypes.FindParams & HttpTypes.StoreProductListParams = {
    limit: 1,
  }

  if (selectedCategory?.id) {
    countQuery.category_id = [selectedCategory.id]
  }

  const {
    response: { count },
  } = await listProducts({
    pageParam: 1,
    queryParams: countQuery,
    countryCode,
  })

  return (
    <StoreClientWrapper
      sortBy={sort}
      categories={categories}
      selectedCategory={selectedCategory}
    >
      <section className="content-container py-8 small:py-12" data-testid="category-container">
        <div className="flex flex-col gap-7 border-b border-ui-border-base pb-8 small:flex-row small:items-start small:justify-between">
          <div>
            <h1
              className="text-4xl font-semibold tracking-tight text-ui-fg-base small:text-5xl"
              data-testid="store-page-title"
            >
              {title}
            </h1>
            <p className="mt-3 text-base text-ui-fg-subtle">
              Tout ce qu'il vous faut pour votre maison modulaire.
            </p>
            <p className="mt-7 text-sm text-ui-fg-subtle">{count} produits</p>
          </div>
          <div className="small:pt-1">
            <StoreToolbar sortBy={sort} view={view} />
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="hidden w-[276px] shrink-0 lg:block">
            <RefinementList
              sortBy={sort}
              categories={categories}
              selectedCategory={selectedCategory?.handle}
              data-testid="sort-by-container"
            />
          </aside>
          <div className="min-w-0 flex-1">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                view={view}
                minPrice={minPrice}
                maxPrice={maxPrice}
                categoryId={selectedCategory?.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </StoreClientWrapper>
  )
}

export default StoreTemplate
