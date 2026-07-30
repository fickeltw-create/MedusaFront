import { redirect } from 'next/navigation';

type Props = {
  params: {
    handle: string;
  };
};

export default function ProductPage({ params }: Props) {
  // Redirect to our embedded Medusa store's product page
  redirect(`/shop/products/${params.handle}`);
}