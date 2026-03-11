import { Metadata } from 'next';
import StorePage from '@/components/StorePage';
import { getStoreBySlug, STORE_THEMES } from '@/lib/stores';

export const metadata: Metadata = {
  title: 'Shorty Intimissimi — Voucher Esclusivo',
  description: 'Ottieni il tuo voucher promozionale per Shorty Intimissimi. Comfort e sensualità premium.',
};

export default function IntimissimiPage() {
  const store = getStoreBySlug('intimissimi')!;
  const theme = STORE_THEMES['intimissimi'];
  return <StorePage store={store} theme={theme} />;
}
