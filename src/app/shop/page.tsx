import { redirect } from 'next/navigation';

export default function ShopPage() {
  // Rediriger l'ancienne page /shop vers la nouvelle page /boutique qui utilise le reverse proxy
  redirect('/boutique');
}