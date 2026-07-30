"use client"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low → High",
  },
  {
    value: "price_desc",
    label: "Price: High → Low",
  },
]

const buttonBase =
  "w-full rounded-full border px-4 py-2 min-h-[44px] text-small-regular font-medium text-left transition-all duration-200"

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="txt-compact-small-plus text-ui-fg-muted">Sort By</div>
      <div className="flex flex-col gap-3" data-testid={dataTestId}>
        {sortOptions.map((option) => {
          const isActive = option.value === sortBy

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange(option.value)}
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
  )
}

export default SortProducts
