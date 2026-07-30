"use client"

import { useState, useEffect } from "react"

type MobileActionButtonsProps = {
  title: string
  onOpenFilters: () => void
  onOpenSort: () => void
  className?: string
}

const MobileActionButtons = ({
  title,
  onOpenFilters,
  onOpenSort,
  className = "",
}: MobileActionButtonsProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      // Hide on desktop (screens > 1023px)
      setIsVisible(window.innerWidth <= 1023)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  if (!isVisible) return null

  return (
    <div className={`flex flex-col pt-4 pb-2 mb-6 ${className}`}>
      {/* Title - perfectly centered with proper spacing below header */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6" data-testid="store-page-title">
        {title}
      </h1>

      {/* Action buttons - centered below title with equal spacing */}
      <div className="flex items-center justify-center gap-4">
        {/* Sort button */}
        <button
          onClick={onOpenSort}
          className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open sort options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          Sort
        </button>

        {/* Filter button */}
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open filters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
        </button>
      </div>
    </div>
  )
}

export default MobileActionButtons