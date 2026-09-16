"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { SortOptions } from "./refinement-list/sort-products"

type StoreToolbarProps = {
  sortBy: SortOptions
  view: "grid" | "list"
}

const sortOptions: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Recommandé" },
  { value: "price_asc", label: "Prix : croissant" },
  { value: "price_desc", label: "Prix : décroissant" },
]

const GridIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="5" height="5" rx="1" />
    <rect x="12" y="3" width="5" height="5" rx="1" />
    <rect x="3" y="12" width="5" height="5" rx="1" />
    <rect x="12" y="12" width="5" height="5" rx="1" />
  </svg>
)

const ListIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 5h10M7 10h10M7 15h10" strokeLinecap="round" />
    <path d="M3.5 5h.01M3.5 10h.01M3.5 15h.01" strokeLinecap="round" strokeWidth="2.5" />
  </svg>
)

export default function StoreToolbar({ sortBy, view }: StoreToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateQuery = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(name, value)
    if (name === "sortBy" || name === "view") params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <label htmlFor="store-sort" className="sr-only">
        Trier les produits
      </label>
      <div className="relative">
        <select
          id="store-sort"
          value={sortBy}
          onChange={(event) => updateQuery("sortBy", event.target.value)}
          className="h-10 min-w-[184px] appearance-none rounded-md border border-ui-border-base bg-ui-bg-base py-2 pl-3 pr-9 text-xs font-semibold text-ui-fg-base outline-none transition-colors hover:border-ui-border-strong focus:border-ui-border-interactive"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              Trier par : {option.label}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m5 7 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Vue en grille"
          aria-pressed={view === "grid"}
          onClick={() => updateQuery("view", "grid")}
          className={`flex h-10 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition-colors ${view === "grid" ? "border-ui-border-base bg-ui-bg-field text-ui-fg-base" : "border-ui-border-base bg-ui-bg-base text-ui-fg-muted hover:text-ui-fg-base"}`}
        >
          <GridIcon />
          Grille
        </button>
        <button
          type="button"
          aria-label="Vue en liste"
          aria-pressed={view === "list"}
          onClick={() => updateQuery("view", "list")}
          className={`flex h-10 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition-colors ${view === "list" ? "border-ui-border-base bg-ui-bg-field text-ui-fg-base" : "border-ui-border-base bg-ui-bg-base text-ui-fg-muted hover:text-ui-fg-base"}`}
        >
          <ListIcon />
          Liste
        </button>
      </div>
    </div>
  )
}