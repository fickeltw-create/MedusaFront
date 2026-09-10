import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import AddToCartButton from "./add-to-cart-button"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  view = "grid",
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  view?: "grid" | "list"
}) {
  const { cheapestPrice } = getProductPrice({ product })
  const quickAddVariant = product.variants?.[0]
  const inStock = Boolean(quickAddVariant)
  const isList = view === "list"

  return (
    <article
      className={`relative overflow-hidden rounded-md border border-ui-border-base bg-ui-bg-base transition-all hover:-translate-y-0.5 hover:border-ui-border-strong hover:shadow-elevation-card-hover ${
        isList ? "grid grid-cols-[180px_minmax(0,1fr)]" : ""
      }`}
    >
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className={isList ? "group contents" : "group block"}
      >
        <div className="relative">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            className={`rounded-none bg-ui-bg-subtle p-0 shadow-none group-hover:shadow-none ${
              isList ? "h-full min-h-[180px] aspect-auto" : ""
            }`}
          />
        </div>
        <div className="flex min-h-[112px] flex-col justify-between gap-4 p-3">
          <Text
            className="line-clamp-2 text-sm font-medium leading-5 text-ui-fg-base"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div className="flex items-end justify-between gap-2">
            {cheapestPrice && (
              <div className="flex min-w-0 items-baseline gap-2">
                <PreviewPrice price={cheapestPrice} />
              </div>
            )}
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                inStock
                  ? "bg-green-50 text-green-700"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              {inStock ? "En stock" : "Précommande"}
            </span>
          </div>
        </div>
      </LocalizedClientLink>
      <AddToCartButton variantId={quickAddVariant?.id} disabled={!inStock} />
    </article>
  )
}
