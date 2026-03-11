import { NextRequest, NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  // Auth check
  const session = request.cookies.get('admin_session');
  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ success: false, error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    await initDB();
    return NextResponse.json({ success: true, message: 'Tabelle create con successo' });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Errore nella creazione tabelle: ' + String(err) },
      { status: 500 }
    );
  }
}
