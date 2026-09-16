import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{
    handle: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  // Redirect to our embedded Medusa store's product page
  const { handle } = await params;
  redirect(`/shop/products/${handle}`);
}