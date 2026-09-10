import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

const parsePrice = (value?: string) => {
  if (!value?.trim()) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  view = "grid",
  minPrice,
  maxPrice,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  view?: "grid" | "list"
  minPrice?: string
  maxPrice?: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }

  if (categoryId) {
    queryParams.category_id = [categoryId]
  }

  if (productsIds) {
    queryParams.id = productsIds
  }

  if (sortBy === "created_at") {
    queryParams.order = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    minPrice: parsePrice(minPrice),
    maxPrice: parsePrice(maxPrice),
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
  const gridClass =
    view === "list"
      ? "grid w-full grid-cols-1 gap-4"
      : "grid w-full grid-cols-1 gap-x-5 gap-y-7 small:grid-cols-2 medium:grid-cols-3 large:grid-cols-4"

  return (
    <>
      <ul className={gridClass} data-testid="products-list">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} view={view} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
