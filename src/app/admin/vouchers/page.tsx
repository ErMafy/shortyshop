'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VoucherWithStore } from '@/lib/types';
import { STORES } from '@/lib/stores';
import { formatCurrency, formatDate } from '@/lib/voucher-utils';

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<VoucherWithStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<VoucherWithStore | null>(null);
  const [verifyError, setVerifyError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (storeFilter) params.set('store_id', storeFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/vouchers?${params.toString()}`);
      const data = await res.json();
      if (data.success) setVouchers(data.data);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeFilter, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVouchers();
  };

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setVerifyError('');
    setVerifyResult(null);
    setVerifyLoading(true);

    try {
      const res = await fetch(
        `/api/admin/verify?code=${encodeURIComponent(manualCode.trim())}`
      );
      const data = await res.json();
      if (data.success) {
        setVerifyResult(data.data);
      } else {
        setVerifyError(data.error || 'Voucher non trovato');
      }
    } catch {
      setVerifyError('Errore di connessione');
    } finally {
      setVerifyLoading(false);
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'active': return { text: 'Attivo', cls: 'bg-green-100 text-green-700' };
      case 'used': return { text: 'Utilizzato', cls: 'bg-gray-100 text-gray-700' };
      case 'expired': return { text: 'Scaduto', cls: 'bg-red-100 text-red-700' };
      default: return { text: status, cls: 'bg-gray-100 text-gray-600' };
    }
  };

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
              <span className="font-semibold">Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/vouchers" className="text-sm font-medium text-black">
                Voucher
              </Link>
              <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-black transition-colors">
                Dashboard
              </Link>
              <Link href="/" className="text-sm text-gray-500 hover:text-black transition-colors">
                ← Sito
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Manual Verify */}
        <div className="flex items-center justify-between mb-8">
          <div />
          <Link
            href="/admin/vouchers/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crea Voucher
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Verifica Manuale Voucher
          </h2>
          <form onSubmit={handleManualVerify} className="flex gap-3">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Inserisci codice voucher (es. SSU-8K4P2X)"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-sm"
            />
            <button
              type="submit"
              disabled={verifyLoading}
              className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 text-sm whitespace-nowrap"
            >
              {verifyLoading ? 'Verifica...' : 'Verifica'}
            </button>
          </form>

          {verifyError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{verifyError}</p>
            </div>
          )}

          {verifyResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold">{verifyResult.first_name} {verifyResult.last_name}</p>
                  <p className="text-sm text-gray-500">{verifyResult.store.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabel(verifyResult.status).cls}`}>
                  {statusLabel(verifyResult.status).text}
                </span>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-gray-400">Codice: </span>
                  <span className="font-mono font-bold">{verifyResult.voucher_code}</span>
                </div>
                <div>
                  <span className="text-gray-400">Importo: </span>
                  <span className="font-bold">{formatCurrency(verifyResult.amount)}</span>
                </div>
              </div>
              {verifyResult.status === 'active' && (
                <Link
                  href={`/admin/redeem/${verifyResult.redeem_token}`}
                  className="inline-block mt-3 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Vai alla pagina di verifica →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Lista Voucher</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca per nome, cognome o codice..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Cerca
              </button>
            </form>
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="">Tutti i negozi</option>
              {STORES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="">Tutti gli stati</option>
              <option value="active">Attivo</option>
              <option value="used">Utilizzato</option>
              <option value="expired">Scaduto</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full" />
          </div>
        ) : vouchers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-1">Nessun voucher trovato</h3>
            <p className="text-gray-500 text-sm">I voucher creati appariranno qui</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Codice</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Negozio</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Importo</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {vouchers.map((v) => {
                    const st = statusLabel(v.status);
                    return (
                      <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="text-sm font-medium">{v.first_name} {v.last_name}</p>
                          <p className="text-xs text-gray-400">{v.email || v.phone}</p>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-sm font-bold">{v.voucher_code}</span>
                        </td>
                        <td className="p-4 text-sm">{v.store.name}</td>
                        <td className="p-4 text-sm font-semibold">{formatCurrency(v.amount)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${st.cls}`}>
                            {st.text}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">{formatDate(v.created_at)}</td>
                        <td className="p-4">
                          <Link
                            href={`/admin/redeem/${v.redeem_token}`}
                            className="text-sm font-medium text-black hover:underline"
                          >
                            Dettagli
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
