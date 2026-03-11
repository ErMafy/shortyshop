'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { VoucherWithStore } from '@/lib/types';
import { formatCurrency, formatDate, isExpired } from '@/lib/voucher-utils';

export default function AdminRedeemPage() {
  const params = useParams();
  const token = params.token as string;
  const [voucher, setVoucher] = useState<VoucherWithStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [redeemError, setRedeemError] = useState('');

  useEffect(() => {
    async function fetchVoucher() {
      try {
        const res = await fetch(`/api/vouchers/${token}`);
        const data = await res.json();
        if (data.success) {
          setVoucher(data.data);
        } else {
          setError(data.error || 'Voucher non trovato');
        }
      } catch {
        setError('Errore nel caricamento');
      } finally {
        setLoading(false);
      }
    }
    fetchVoucher();
  }, [token]);

  const handleRedeem = async () => {
    if (!voucher) return;
    setRedeeming(true);
    setRedeemError('');

    try {
      const res = await fetch('/api/admin/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucher_id: voucher.id,
          admin_id: 'admin',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRedeemed(true);
        setVoucher((prev) =>
          prev ? { ...prev, status: 'used', used_at: new Date().toISOString() } : null
        );
      } else {
        setRedeemError(data.error || 'Errore durante il riscatto');
      }
    } catch {
      setRedeemError('Errore di connessione');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full" />
      </div>
    );
  }

  if (error || !voucher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Voucher non trovato</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href="/admin/vouchers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            ← Torna alla lista
          </Link>
        </div>
      </div>
    );
  }

  const expired = isExpired(voucher.expires_at);
  const isUsed = voucher.status === 'used';
  const isActive = voucher.status === 'active' && !expired;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold">Verifica Voucher</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/vouchers" className="text-sm text-gray-500 hover:text-black transition-colors">
                ← Lista Voucher
              </Link>
              <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-black transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        {isUsed && (
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 mb-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-700">Voucher già utilizzato</h2>
            {voucher.used_at && (
              <p className="text-sm text-gray-500 mt-1">
                Utilizzato il {formatDate(voucher.used_at)}
              </p>
            )}
          </div>
        )}

        {expired && !isUsed && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-red-700">Voucher scaduto</h2>
            <p className="text-sm text-red-500 mt-1">
              Scaduto il {formatDate(voucher.expires_at)}
            </p>
          </div>
        )}

        {redeemed && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-green-700">Voucher riscattato con successo!</h2>
            <p className="text-sm text-green-600 mt-1">Il voucher è stato segnato come utilizzato</p>
          </div>
        )}

        {/* Voucher Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className={`p-6 ${
            isActive ? 'bg-green-600' : isUsed ? 'bg-gray-600' : 'bg-red-600'
          } text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                  Voucher {voucher.store.name}
                </p>
                <p className="text-2xl font-bold font-mono">{voucher.voucher_code}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Valore</p>
                <p className="text-3xl font-bold">{formatCurrency(voucher.amount)}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Nome</p>
                <p className="font-semibold">{voucher.first_name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Cognome</p>
                <p className="font-semibold">{voucher.last_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Negozio</p>
                <p className="font-semibold">{voucher.store.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Importo</p>
                <p className="font-semibold">{formatCurrency(voucher.amount)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Codice Voucher</p>
                <p className="font-mono font-bold">{voucher.voucher_code}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Stato</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  isActive ? 'bg-green-100 text-green-700' :
                  isUsed ? 'bg-gray-100 text-gray-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {isActive ? 'Attivo' : isUsed ? 'Utilizzato' : 'Scaduto'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Creato il</p>
                <p className="text-sm">{formatDate(voucher.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Scadenza</p>
                <p className="text-sm">{formatDate(voucher.expires_at)}</p>
              </div>
            </div>

            {voucher.phone && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Telefono</p>
                <p className="text-sm">{voucher.phone}</p>
              </div>
            )}

            {voucher.email && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm">{voucher.email}</p>
              </div>
            )}

            {voucher.used_at && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Utilizzato il</p>
                <p className="text-sm">{formatDate(voucher.used_at)}</p>
              </div>
            )}
          </div>

          {/* Action */}
          {isActive && !redeemed && (
            <div className="p-6 border-t border-gray-100">
              {redeemError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{redeemError}</p>
                </div>
              )}
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 text-sm"
              >
                {redeeming ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Elaborazione...
                  </span>
                ) : (
                  '✓ Segna come usato'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
