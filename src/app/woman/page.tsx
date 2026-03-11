import { Metadata } from 'next';
import StorePage from '@/components/StorePage';
import { getStoreBySlug, STORE_THEMES } from '@/lib/stores';

export const metadata: Metadata = {
  title: 'Shorty Woman — Voucher Esclusivo',
  description: 'Ottieni il tuo voucher promozionale per Shorty Woman. Femminilità e stile senza tempo.',
};

export default function WomanPage() {
  const store = getStoreBySlug('woman')!;
  const theme = STORE_THEMES['woman'];
  return <StorePage store={store} theme={theme} />;
}
