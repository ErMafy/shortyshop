// ================================================
// Store Configuration
// ================================================

import { Store } from './types';

export const STORES: Store[] = [
  {
    id: 'store-uomo',
    name: 'Shorty Uomo',
    slug: 'uomo',
    voucher_amount: 20,
    created_at: new Date().toISOString(),
  },
  {
    id: 'store-woman',
    name: 'Shorty Woman',
    slug: 'woman',
    voucher_amount: 25,
    created_at: new Date().toISOString(),
  },
  {
    id: 'store-intimissimi',
    name: 'Shorty Intimissimi',
    slug: 'intimissimi',
    voucher_amount: 15,
    created_at: new Date().toISOString(),
  },
];

export const STORE_THEMES: Record<string, {
  gradient: string;
  accent: string;
  accentHover: string;
  bgLight: string;
  icon: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
}> = {
  uomo: {
    gradient: 'from-slate-900 via-zinc-800 to-slate-900',
    accent: 'bg-amber-500',
    accentHover: 'hover:bg-amber-600',
    bgLight: 'bg-amber-50',
    icon: '👔',
    description: 'Stile maschile raffinato. Scopri la collezione uomo con capi selezionati per l\'uomo contemporaneo che non rinuncia all\'eleganza.',
    heroTitle: 'Eleganza Maschile',
    heroSubtitle: 'Visita il negozio per ricevere il tuo voucher esclusivo',
  },
  woman: {
    gradient: 'from-rose-900 via-pink-800 to-rose-900',
    accent: 'bg-rose-500',
    accentHover: 'hover:bg-rose-600',
    bgLight: 'bg-rose-50',
    icon: '👗',
    description: 'Femminilità contemporanea. Esplora una selezione curata di capi donna, dal casual chic all\'eleganza senza tempo.',
    heroTitle: 'Stile Femminile',
    heroSubtitle: 'Visita il negozio per ricevere il tuo voucher esclusivo',
  },
  intimissimi: {
    gradient: 'from-purple-900 via-violet-800 to-purple-900',
    accent: 'bg-violet-500',
    accentHover: 'hover:bg-violet-600',
    bgLight: 'bg-violet-50',
    icon: '✨',
    description: 'Comfort e sensualità. Intimo di qualità superiore per chi cerca il massimo in termini di comfort, tessuti e design.',
    heroTitle: 'Intimo Premium',
    heroSubtitle: 'Visita il negozio per ricevere il tuo voucher esclusivo',
  },
};

export function getStoreBySlug(slug: string): Store | undefined {
  return STORES.find((s) => s.slug === slug);
}

export function getStorePrefix(slug: string): string {
  const prefixes: Record<string, string> = {
    uomo: 'SSU',
    woman: 'SSW',
    intimissimi: 'SSI',
  };
  return prefixes[slug] || 'SS';
}

// Admin credentials (in production, store hashed in DB)
export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD_HASH = '$2a$10$XQxBj8JETH0Zjv0C8f8Gu.oaYKFqHh2QE8K8q6v5mZz5v5aqLC3u6'; // "shorty2024"
