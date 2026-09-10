"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function Pagination({
  page,
  totalPages,
  "data-testid": dataTestid,
}: {
  page: number
  totalPages: number
  "data-testid"?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const pageButton = (pageNumber: number, label: string | number) => {
    const isCurrent = pageNumber === page

    return (
      <button
        key={pageNumber}
        type="button"
        aria-current={isCurrent ? "page" : undefined}
        disabled={isCurrent}
        onClick={() => handlePageChange(pageNumber)}
        className={`flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm transition-colors ${isCurrent ? "border-ui-border-strong bg-ui-bg-field font-semibold text-ui-fg-base" : "border-transparent text-ui-fg-muted hover:border-ui-border-base hover:text-ui-fg-base"}`}
      >
        {label}
      </button>
    )
  }

  const ellipsis = (key: string) => (
    <span key={key} className="flex h-9 min-w-9 items-center justify-center px-1 text-sm text-ui-fg-muted">
      ...
    </span>
  )

  const renderPageButtons = () => {
    if (totalPages <= 7) {
      return arrayRange(1, totalPages).map((pageNumber) => pageButton(pageNumber, pageNumber))
    }

    if (page <= 4) {
      return [
        ...arrayRange(1, 5).map((pageNumber) => pageButton(pageNumber, pageNumber)),
        ellipsis("ellipsis-start"),
        pageButton(totalPages, totalPages),
      ]
    }

    if (page >= totalPages - 3) {
      return [
        pageButton(1, 1),
        ellipsis("ellipsis-end"),
        ...arrayRange(totalPages - 4, totalPages).map((pageNumber) => pageButton(pageNumber, pageNumber)),
      ]
    }

    return [
      pageButton(1, 1),
      ellipsis("ellipsis-before-current"),
      ...arrayRange(page - 1, page + 1).map((pageNumber) => pageButton(pageNumber, pageNumber)),
      ellipsis("ellipsis-after-current"),
      pageButton(totalPages, totalPages),
    ]
  }

  return (
    <nav className="mt-10 flex w-full justify-center" aria-label="Pagination des produits">
      <div className="flex items-center gap-1" data-testid={dataTestid}>
        <button
          type="button"
          aria-label="Page précédente"
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-ui-border-base text-ui-fg-base transition-colors hover:bg-ui-bg-field disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="m12.5 4.5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {renderPageButtons()}
        <button
          type="button"
          aria-label="Page suivante"
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-ui-border-base text-ui-fg-base transition-colors hover:bg-ui-bg-field disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="m7.5 4.5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </nav>
  )
}