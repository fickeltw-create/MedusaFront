import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { listCategories } from "@lib/data/categories"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, category: selectedCategoryHandle } = searchParams

  const categories = await listCategories({
    limit: 100,
    fields: "id,handle,name,parent_category",
  })

  const topCategories = categories.filter((category) => !category.parent_category)
  const selectedCategory = categories.find(
    (category) => category.handle === selectedCategoryHandle
  )

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      categories={topCategories}
      selectedCategory={selectedCategory}
    />
  )
}
