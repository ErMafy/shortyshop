import { Metadata } from 'next';
import StorePage from '@/components/StorePage';
import { getStoreBySlug, STORE_THEMES } from '@/lib/stores';

export const metadata: Metadata = {
  title: 'Shorty Uomo — Voucher Esclusivo',
  description: 'Ottieni il tuo voucher promozionale per Shorty Uomo. Eleganza maschile contemporanea.',
};

export default function UomoPage() {
  const store = getStoreBySlug('uomo')!;
  const theme = STORE_THEMES['uomo'];
  return <StorePage store={store} theme={theme} />;
}
