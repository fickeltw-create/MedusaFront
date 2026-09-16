import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="min-w-0">
      {product.collection && (
        <LocalizedClientLink href={`/collections/${product.collection.handle}`} className="mb-4 block text-xs font-medium uppercase tracking-[0.16em] text-ui-fg-muted hover:text-ui-fg-base">
          {product.collection.title}
        </LocalizedClientLink>
      )}
      <Heading level="h1" className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-ui-fg-base small:text-3xl" data-testid="product-title">
        {product.title}
      </Heading>
    </div>
  )
}

export default ProductInfo