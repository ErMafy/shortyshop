// ================================================
// Neon PostgreSQL Database
// ================================================

import { neon } from '@neondatabase/serverless';
import { Voucher, VoucherWithStore, DashboardStats } from './types';
import { STORES } from './stores';

function getSQL() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL non configurata');
  return neon(url);
}

// Initialize tables on first import
export async function initDB() {
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS vouchers (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      voucher_code TEXT UNIQUE NOT NULL,
      redeem_token TEXT UNIQUE NOT NULL,
      amount NUMERIC(10,2) NOT NULL,
      store_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      used_by_admin TEXT
    )
  `;
}

function rowToVoucher(row: Record<string, unknown>): Voucher {
  return {
    id: row.id as string,
    first_name: row.first_name as string,
    last_name: row.last_name as string,
    phone: (row.phone as string) || null,
    email: (row.email as string) || null,
    voucher_code: row.voucher_code as string,
    redeem_token: row.redeem_token as string,
    amount: Number(row.amount),
    store_id: row.store_id as string,
    status: row.status as 'active' | 'used' | 'expired',
    created_at: String(row.created_at),
    expires_at: String(row.expires_at),
    used_at: row.used_at ? String(row.used_at) : null,
    used_by_admin: (row.used_by_admin as string) || null,
  };
}

function attachStore(v: Voucher): VoucherWithStore | null {
  const store = STORES.find((s) => s.id === v.store_id);
  if (!store) return null;
  return { ...v, store };
}

export const db = {
  async createVoucher(data: Omit<Voucher, 'id'>): Promise<Voucher> {
    const sql = getSQL();
    const id = crypto.randomUUID();
    const rows = await sql`
      INSERT INTO vouchers (id, first_name, last_name, phone, email, voucher_code, redeem_token, amount, store_id, status, created_at, expires_at, used_at, used_by_admin)
      VALUES (${id}, ${data.first_name}, ${data.last_name}, ${data.phone}, ${data.email}, ${data.voucher_code}, ${data.redeem_token}, ${data.amount}, ${data.store_id}, ${data.status}, ${data.created_at}, ${data.expires_at}, ${data.used_at}, ${data.used_by_admin})
      RETURNING *
    `;
    return rowToVoucher(rows[0]);
  },

  async getVoucherByCode(code: string): Promise<VoucherWithStore | null> {
    const sql = getSQL();
    const rows = await sql`SELECT * FROM vouchers WHERE LOWER(voucher_code) = LOWER(${code}) LIMIT 1`;
    if (rows.length === 0) return null;
    return attachStore(rowToVoucher(rows[0]));
  },

  async getVoucherByToken(token: string): Promise<VoucherWithStore | null> {
    const sql = getSQL();
    const rows = await sql`SELECT * FROM vouchers WHERE redeem_token = ${token} LIMIT 1`;
    if (rows.length === 0) return null;
    return attachStore(rowToVoucher(rows[0]));
  },

  async getVoucherById(id: string): Promise<VoucherWithStore | null> {
    const sql = getSQL();
    const rows = await sql`SELECT * FROM vouchers WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) return null;
    return attachStore(rowToVoucher(rows[0]));
  },

  async markAsUsed(id: string, adminId: string): Promise<boolean> {
    const sql = getSQL();
    // First check current status
    const rows = await sql`SELECT * FROM vouchers WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) return false;
    const v = rowToVoucher(rows[0]);
    if (v.status !== 'active') return false;
    if (new Date(v.expires_at) < new Date()) {
      await sql`UPDATE vouchers SET status = 'expired' WHERE id = ${id}`;
      return false;
    }
    const now = new Date().toISOString();
    await sql`UPDATE vouchers SET status = 'used', used_at = ${now}, used_by_admin = ${adminId} WHERE id = ${id}`;
    return true;
  },

  async getAllVouchers(filters?: {
    store_id?: string;
    status?: string;
    search?: string;
  }): Promise<VoucherWithStore[]> {
    const sql = getSQL();
    let rows;

    if (filters?.store_id && filters?.status && filters?.search) {
      const q = `%${filters.search.toLowerCase()}%`;
      rows = await sql`
        SELECT * FROM vouchers
        WHERE store_id = ${filters.store_id}
          AND status = ${filters.status}
          AND (LOWER(first_name) LIKE ${q} OR LOWER(last_name) LIKE ${q} OR LOWER(voucher_code) LIKE ${q} OR LOWER(COALESCE(email,'')) LIKE ${q} OR COALESCE(phone,'') LIKE ${q})
        ORDER BY created_at DESC
      `;
    } else if (filters?.store_id && filters?.status) {
      rows = await sql`
        SELECT * FROM vouchers WHERE store_id = ${filters.store_id} AND status = ${filters.status} ORDER BY created_at DESC
      `;
    } else if (filters?.store_id && filters?.search) {
      const q = `%${filters.search.toLowerCase()}%`;
      rows = await sql`
        SELECT * FROM vouchers
        WHERE store_id = ${filters.store_id}
          AND (LOWER(first_name) LIKE ${q} OR LOWER(last_name) LIKE ${q} OR LOWER(voucher_code) LIKE ${q} OR LOWER(COALESCE(email,'')) LIKE ${q} OR COALESCE(phone,'') LIKE ${q})
        ORDER BY created_at DESC
      `;
    } else if (filters?.status && filters?.search) {
      const q = `%${filters.search.toLowerCase()}%`;
      rows = await sql`
        SELECT * FROM vouchers
        WHERE status = ${filters.status}
          AND (LOWER(first_name) LIKE ${q} OR LOWER(last_name) LIKE ${q} OR LOWER(voucher_code) LIKE ${q} OR LOWER(COALESCE(email,'')) LIKE ${q} OR COALESCE(phone,'') LIKE ${q})
        ORDER BY created_at DESC
      `;
    } else if (filters?.store_id) {
      rows = await sql`SELECT * FROM vouchers WHERE store_id = ${filters.store_id} ORDER BY created_at DESC`;
    } else if (filters?.status) {
      rows = await sql`SELECT * FROM vouchers WHERE status = ${filters.status} ORDER BY created_at DESC`;
    } else if (filters?.search) {
      const q = `%${filters.search.toLowerCase()}%`;
      rows = await sql`
        SELECT * FROM vouchers
        WHERE LOWER(first_name) LIKE ${q} OR LOWER(last_name) LIKE ${q} OR LOWER(voucher_code) LIKE ${q} OR LOWER(COALESCE(email,'')) LIKE ${q} OR COALESCE(phone,'') LIKE ${q}
        ORDER BY created_at DESC
      `;
    } else {
      rows = await sql`SELECT * FROM vouchers ORDER BY created_at DESC`;
    }

    return rows
      .map((r) => attachStore(rowToVoucher(r)))
      .filter((v): v is VoucherWithStore => v !== null);
  },

  async getStats(): Promise<DashboardStats> {
    const sql = getSQL();
    const countRows = await sql`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status = 'used') as used,
        COUNT(*) FILTER (WHERE status = 'expired') as expired
      FROM vouchers
    `;
    const byStoreRows = await sql`
      SELECT store_id, COUNT(*) as count FROM vouchers GROUP BY store_id
    `;

    const c = countRows[0];
    const byStore = STORES.map((store) => {
      const row = byStoreRows.find((r) => r.store_id === store.id);
      return { store_name: store.name, count: Number(row?.count ?? 0) };
    });

    return {
      total_vouchers: Number(c.total),
      active_vouchers: Number(c.active),
      used_vouchers: Number(c.used),
      expired_vouchers: Number(c.expired),
      vouchers_by_store: byStore,
    };
  },

  async codeExists(code: string): Promise<boolean> {
    const sql = getSQL();
    const rows = await sql`SELECT 1 FROM vouchers WHERE voucher_code = ${code} LIMIT 1`;
    return rows.length > 0;
  },
};
