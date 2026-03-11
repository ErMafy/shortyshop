// ================================================
// Types & Interfaces
// ================================================

export interface Store {
  id: string;
  name: string;
  slug: string;
  voucher_amount: number;
  created_at: string;
}

export interface Voucher {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  voucher_code: string;
  redeem_token: string;
  amount: number;
  store_id: string;
  status: 'active' | 'used' | 'expired';
  created_at: string;
  expires_at: string;
  used_at: string | null;
  used_by_admin: string | null;
}

export interface VoucherWithStore extends Voucher {
  store: Store;
}

export interface VoucherFormData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  contact_method: 'phone' | 'email';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  total_vouchers: number;
  active_vouchers: number;
  used_vouchers: number;
  expired_vouchers: number;
  vouchers_by_store: { store_name: string; count: number }[];
}
