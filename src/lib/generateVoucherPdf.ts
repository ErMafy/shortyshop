import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { formatCurrency, formatDate } from './voucher-utils';

interface VoucherPdfData {
  firstName: string;
  lastName: string;
  storeName: string;
  amount: number;
  voucherCode: string;
  expiresAt: string;
  redeemToken: string;
  baseUrl: string;
}

export async function generateVoucherPdf(data: VoucherPdfData): Promise<Buffer> {
  const { firstName, lastName, storeName, amount, voucherCode, expiresAt, redeemToken, baseUrl } = data;

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
  doc.text(`${firstName} ${lastName}`, 40, 40);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Negozio:', 16, 48);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 10, 10);
  doc.text(storeName, 40, 48);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Valore:', 16, 56);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 10, 10);
  doc.setFontSize(14);
  doc.text(formatCurrency(amount), 40, 56);

  // Code
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Codice:', 16, 66);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 10, 10);
  doc.setFontSize(14);
  doc.text(voucherCode, 40, 66);

  // Dates
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(`Emesso il: ${formatDate(new Date().toISOString())}`, 16, 76);
  doc.text(`Valido fino al: ${formatDate(expiresAt)}`, 16, 82);

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

  // Generate QR code
  const qrUrl = `${baseUrl}/admin/redeem/${redeemToken}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    width: 200,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
  doc.addImage(qrDataUrl, 'PNG', 158, 15, 40, 40);

  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Scansiona per verificare', 162, 62);
  doc.text('il voucher in negozio', 164, 67);

  // Return as Buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
