'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { VoucherWithStore } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/voucher-utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QRCode from 'qrcode';

export default function VoucherPage() {
  const params = useParams();
  const token = params.token as string;
  const [voucher, setVoucher] = useState<VoucherWithStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    async function fetchVoucher() {
      try {
        const res = await fetch(`/api/vouchers/${token}`);
        const data = await res.json();
        if (data.success) {
          setVoucher(data.data);
          // Generate QR code
          const qrUrl = `${window.location.origin}/admin/redeem/${data.data.redeem_token}`;
          const qr = await QRCode.toDataURL(qrUrl, {
            width: 200,
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' },
          });
          setQrDataUrl(qr);
        } else {
          setError(data.error || 'Voucher non trovato');
        }
      } catch {
        setError('Errore nel caricamento del voucher');
      } finally {
        setLoading(false);
      }
    }
    fetchVoucher();
  }, [token]);

  const handleDownloadPDF = async () => {
    if (!voucher) return;

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
    doc.text(`${voucher.first_name} ${voucher.last_name}`, 40, 40);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Negozio:', 16, 48);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 10, 10);
    doc.text(voucher.store.name, 40, 48);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Valore:', 16, 56);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 10, 10);
    doc.setFontSize(14);
    doc.text(formatCurrency(voucher.amount), 40, 56);

    // Code
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Codice:', 16, 66);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 10, 10);
    doc.setFontSize(14);
    doc.text(voucher.voucher_code, 40, 66);

    // Dates
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(`Emesso il: ${formatDate(voucher.created_at)}`, 16, 76);
    doc.text(`Valido fino al: ${formatDate(voucher.expires_at)}`, 16, 82);

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

    doc.save(`voucher-${voucher.voucher_code}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-16">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full" />
        </main>
      </>
    );
  }

  if (error || !voucher) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Voucher non trovato</h2>
            <p className="text-gray-500">{error}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Il tuo Voucher è pronto!</h1>
            <p className="text-gray-500">Scarica o stampa il voucher per utilizzarlo in negozio</p>
          </div>

          {/* Voucher Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up animation-delay-200">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-gray-950 to-gray-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                    Shorty Shop
                  </p>
                  <p className="text-lg font-bold">{voucher.store.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                    Valore
                  </p>
                  <p className="text-2xl font-bold">{formatCurrency(voucher.amount)}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Details */}
                <div className="space-y-5">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Cliente</p>
                    <p className="font-semibold">{voucher.first_name} {voucher.last_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Codice Voucher</p>
                    <p className="text-2xl font-mono font-bold tracking-wider">{voucher.voucher_code}</p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Emesso il</p>
                      <p className="text-sm font-medium">{formatDate(voucher.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Valido fino al</p>
                      <p className="text-sm font-medium">{formatDate(voucher.expires_at)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Stato</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      voucher.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : voucher.status === 'used'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {voucher.status === 'active' ? 'Attivo' : voucher.status === 'used' ? 'Utilizzato' : 'Scaduto'}
                    </span>
                  </div>
                </div>

                {/* Right: QR Code */}
                <div className="flex flex-col items-center justify-center">
                  {qrDataUrl && (
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm">
                      <img
                        src={qrDataUrl}
                        alt="QR Code Voucher"
                        className="w-40 h-40"
                      />
                    </div>
                  )}
                  <p className="text-gray-400 text-xs mt-3 text-center">
                    Scansiona in negozio per verificare
                  </p>
                </div>
              </div>

              {/* Conditions */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 leading-relaxed">
                  <span className="font-medium text-gray-500">Condizioni d&apos;uso:</span> Il voucher è valido per 30 giorni dalla data di emissione. Utilizzabile una sola volta presso il punto vendita indicato. Non cumulabile con altre promozioni. Non convertibile in denaro. Presentare il QR code o il codice seriale al momento dell&apos;acquisto.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 no-print animate-fade-in-up animation-delay-400">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all btn-shimmer text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Scarica PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Stampa
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
