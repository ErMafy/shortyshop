 'use client';

import { useState } from 'react';
import Link from 'next/link';
import { STORES } from '@/lib/stores';
import { formatCurrency, formatDate } from '@/lib/voucher-utils';
import { Store } from '@/lib/types';
import QRCode from 'qrcode';

interface CreatedVoucher {
  id: string;
  voucher_code: string;
  redeem_token: string;
  amount: number;
  expires_at: string;
  first_name: string;
  last_name: string;
  store: Store;
  email_sent?: boolean;
  email_error?: string | null;
}

export default function AdminCreateVoucherPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [storeSlug, setStoreSlug] = useState(STORES[0].slug);
  const [amount, setAmount] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<CreatedVoucher | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const handleStoreChange = (slug: string) => {
    setStoreSlug(slug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/vouchers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: phone || undefined,
          email: email || undefined,
          store_slug: storeSlug,
          amount: Number(amount),
          expires_at: expiresAt || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Errore nella creazione del voucher');
        return;
      }

      setCreated(data.data);

      // Generate QR code
      const qrUrl = `${window.location.origin}/admin/redeem/${data.data.redeem_token}`;
      const qr = await QRCode.toDataURL(qrUrl, {
        width: 200,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });
      setQrDataUrl(qr);
    } catch {
      setError('Errore di connessione. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!created) return;

    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [210, 100],
    });

    // Background
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, 210, 100, 'F');

    // Left accent bar
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 6, 100, 'F');

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 10, 10);
    doc.text('SHORTY SHOP', 16, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text('VOUCHER PROMOZIONALE', 16, 25);

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.line(16, 30, 140, 30);

    // Client info
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('Cliente:', 16, 40);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 10, 10);
    doc.text(`${created.first_name} ${created.last_name}`, 40, 40);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Negozio:', 16, 48);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 10, 10);
    doc.text(created.store.name, 40, 48);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Valore:', 16, 56);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 10, 10);
    doc.setFontSize(14);
    doc.text(formatCurrency(created.amount), 40, 56);

    // Code
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Codice:', 16, 66);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 10, 10);
    doc.setFontSize(14);
    doc.text(created.voucher_code, 40, 66);

    // Dates
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(`Emesso il: ${formatDate(new Date().toISOString())}`, 16, 76);
    doc.text(`Valido fino al: ${formatDate(created.expires_at)}`, 16, 82);

    // Conditions
    doc.setFontSize(6);
    doc.setTextColor(160, 160, 160);
    doc.text(
      'Voucher valido 30 giorni. Utilizzabile una sola volta. Non cumulabile. Non convertibile in denaro.',
      16,
      92
    );

    // QR Code section (right side)
    doc.setDrawColor(230, 230, 230);
    doc.line(150, 10, 150, 90);

    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 158, 15, 40, 40);
    }

    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text('Scansiona per verificare', 162, 62);
    doc.text('il voucher in negozio', 164, 67);

    doc.save(`voucher-${created.voucher_code}.pdf`);
  };

  const handleReset = () => {
    setCreated(null);
    setQrDataUrl('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setAmount('');
    setExpiresAt('');
    setError('');
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
              <Link href="/admin/vouchers" className="text-sm text-gray-500 hover:text-black transition-colors">
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/admin/vouchers" className="text-sm text-gray-500 hover:text-black transition-colors">
            ← Torna alla lista voucher
          </Link>
        </div>

        {created ? (
          /* ── Success State ── */
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Voucher Creato!</h1>
              <p className="text-gray-500">
                Voucher per {created.first_name} {created.last_name} — {created.store.name}
              </p>
            </div>

            {/* Email status feedback */}
            {created.email_sent && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-green-700 text-sm">
                  Email con voucher PDF inviata con successo!
                </p>
              </div>
            )}
            {created.email_error && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-yellow-700 text-sm">{created.email_error}</p>
              </div>
            )}

            {/* Voucher Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-gray-950 to-gray-800 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Shorty Shop</p>
                    <p className="text-lg font-bold">{created.store.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Valore</p>
                    <p className="text-2xl font-bold">{formatCurrency(created.amount)}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Cliente</p>
                      <p className="font-semibold">{created.first_name} {created.last_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Codice Voucher</p>
                      <p className="text-2xl font-mono font-bold tracking-wider">{created.voucher_code}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Scadenza</p>
                      <p className="text-sm font-medium">{formatDate(created.expires_at)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    {qrDataUrl && (
                      <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm">
                        <img src={qrDataUrl} alt="QR Code Voucher" className="w-40 h-40" />
                      </div>
                    )}
                    <p className="text-gray-400 text-xs mt-3 text-center">
                      Scansiona per verificare / riscattare
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Scarica PDF
              </button>
              <Link
                href={`/admin/redeem/${created.redeem_token}`}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm"
              >
                Pagina Verifica →
              </Link>
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all text-sm"
              >
                + Crea un altro
              </button>
            </div>
          </div>
        ) : (
          /* ── Creation Form ── */
          <div>
            <h1 className="text-2xl font-bold mb-1">Crea Nuovo Voucher</h1>
            <p className="text-gray-500 text-sm mb-8">
              Inserisci i dati del cliente per generare un voucher promozionale.
            </p>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="space-y-6">
                {/* Nome e Cognome */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nome *
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nome del cliente"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Cognome *
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Cognome del cliente"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Contatti (opzionali) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telefono <span className="text-gray-400">(opzionale)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+39 333 1234567"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-gray-400">(opzionale)</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nome@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Se inserita, il voucher PDF verrà inviato via email al cliente.
                    </p>
                  </div>
                </div>

                {/* Negozio */}
                <div>
                  <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Negozio *
                  </label>
                  <select
                    id="store"
                    value={storeSlug}
                    onChange={(e) => handleStoreChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                  >
                    {STORES.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Importo e Scadenza */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Importo (€) *
                    </label>
                    <input
                      id="amount"
                      type="number"
                      required
                      min="0.01"
                      max="500"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Inserisci importo"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Scadenza <span className="text-gray-400">(default: 30 giorni)</span>
                    </label>
                    <input
                      id="expires_at"
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    Creazione in corso...
                  </span>
                ) : (
                  'Genera Voucher'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
