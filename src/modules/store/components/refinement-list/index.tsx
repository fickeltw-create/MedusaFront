"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"

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
  'data-testid'?: string
}

const RefinementList = ({
  sortBy,
  categories = [],
  selectedCategory,
  'data-testid': dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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

  const buttonBase =
    "w-full rounded-full border px-4 py-2 min-h-[44px] text-small-regular font-medium text-left transition-all duration-200"

  const categoryButtons = [
    {
      value: "",
      label: "All",
    },
    ...categories.map((category) => ({
      value: category.handle,
      label: category.name,
    })),
  ]

  return (
    <div className="max-w-[220px] w-full mx-auto border border-ui-border-base bg-ui-bg-base rounded-rounded p-6 space-y-6">
      <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />

      {categories.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="txt-compact-small-plus text-ui-fg-muted">Categories</div>
          <div className="flex flex-col gap-3">
            {categoryButtons.map((option) => {
              const isActive = selectedCategory === option.value || (!selectedCategory && option.value === "")

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setQueryParams("category", option.value)}
                  className={`${buttonBase} ${
                    isActive
                      ? "border-ui-border-interactive bg-ui-bg-interactive text-ui-fg-on-color"
                      : "border-ui-border-base bg-ui-bg-base text-ui-fg-base hover:border-ui-border-interactive hover:bg-ui-bg-field-hover"
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default RefinementList
