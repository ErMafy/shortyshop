import nodemailer from 'nodemailer';

interface VoucherEmailData {
  email: string;
  name: string;
  voucherCode: string;
  store: string;
  amount: number;
  pdfBuffer: Buffer;
}

export async function sendVoucherEmail({
  email,
  name,
  voucherCode,
  store,
  amount,
  pdfBuffer,
}: VoucherEmailData): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const formattedAmount = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);

  await transporter.sendMail({
    from: `"Shorty Shop" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Il tuo voucher Shorty Shop',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a1a1a, #333); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Shorty Shop</h1>
          <p style="color: #aaaaaa; margin: 8px 0 0; font-size: 14px;">Voucher Promozionale</p>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none;">
          <p style="font-size: 16px; color: #333;">Ciao <strong>${escapeHtml(name)}</strong>,</p>
          <p style="font-size: 15px; color: #555; line-height: 1.6;">
            Il tuo voucher Shorty Shop è pronto!
          </p>
          <div style="background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 14px;">Negozio:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #333; font-size: 14px; text-align: right;">${escapeHtml(store)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 14px;">Importo:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #333; font-size: 18px; text-align: right;">${escapeHtml(formattedAmount)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 14px;">Codice voucher:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #333; font-size: 18px; font-family: monospace; text-align: right; letter-spacing: 2px;">${escapeHtml(voucherCode)}</td>
              </tr>
            </table>
          </div>
          <p style="font-size: 14px; color: #555; line-height: 1.6;">
            Mostra questo voucher in negozio per utilizzarlo.
          </p>
          <p style="font-size: 14px; color: #555; line-height: 1.6;">
            In allegato trovi il voucher in formato PDF.
          </p>
        </div>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5; border-top: none; text-align: center;">
          <p style="font-size: 12px; color: #999; margin: 0;">
            Shorty Shop &mdash; Voucher valido 30 giorni. Utilizzabile una sola volta.
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: 'voucher.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
