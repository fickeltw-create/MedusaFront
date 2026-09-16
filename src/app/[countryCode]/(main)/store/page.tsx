import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { listCategories } from "@lib/data/categories"

export const metadata: Metadata = {
  title: "Boutique",
  description: "Découvrez tous nos produits.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
    min_price?: string
    max_price?: string
    view?: "grid" | "list"
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const {
    sortBy,
    page,
    category: selectedCategoryHandle,
    min_price: minPrice,
    max_price: maxPrice,
    view,
  } = searchParams

  const categories = await listCategories({
    limit: 100,
    fields: "id,handle,name,parent_category",
  })

  const selectedCategory = categories.find(
    (category) => category.handle === selectedCategoryHandle
  )

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      view={view}
      minPrice={minPrice}
      maxPrice={maxPrice}
      countryCode={params.countryCode}
      categories={categories}
      selectedCategory={selectedCategory}
    />
  )
}
