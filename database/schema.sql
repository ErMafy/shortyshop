-- ================================================
-- SHORTY SHOP - Database Schema
-- Compatible with Supabase / PostgreSQL
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- STORES TABLE
-- ================================================
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  voucher_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- VOUCHERS TABLE
-- ================================================
CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(255),
  voucher_code VARCHAR(20) NOT NULL UNIQUE,
  redeem_token UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  amount DECIMAL(10,2) NOT NULL,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  used_by_admin VARCHAR(100),
  CONSTRAINT phone_or_email CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

-- Indexes for fast lookups
CREATE INDEX idx_vouchers_voucher_code ON vouchers(voucher_code);
CREATE INDEX idx_vouchers_redeem_token ON vouchers(redeem_token);
CREATE INDEX idx_vouchers_store_id ON vouchers(store_id);
CREATE INDEX idx_vouchers_status ON vouchers(status);
CREATE INDEX idx_vouchers_created_at ON vouchers(created_at DESC);

-- ================================================
-- SEED DATA
-- ================================================
INSERT INTO stores (name, slug, voucher_amount) VALUES
  ('Shorty Uomo', 'uomo', 20.00),
  ('Shorty Woman', 'woman', 25.00),
  ('Shorty Intimissimi', 'intimissimi', 15.00);
