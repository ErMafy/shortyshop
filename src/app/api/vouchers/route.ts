import { NextResponse } from 'next/server';

// Public voucher creation is disabled.
// Vouchers are created exclusively by admin at /api/admin/vouchers/create
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Creazione voucher pubblica disabilitata' },
    { status: 403 }
  );
}
