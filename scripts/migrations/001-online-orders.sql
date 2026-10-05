CREATE TABLE IF NOT EXISTS ja_orders (
  id UUID PRIMARY KEY, request_id UUID NOT NULL UNIQUE, request_hash TEXT NOT NULL,
  reference TEXT NOT NULL UNIQUE, token TEXT NOT NULL UNIQUE,
  customer JSONB NOT NULL, items JSONB NOT NULL,
  subtotal_cents INTEGER NOT NULL CHECK (subtotal_cents > 0),
  delivery_cents INTEGER NOT NULL CHECK (delivery_cents = 5000),
  total_cents INTEGER NOT NULL CHECK (total_cents = subtotal_cents + delivery_cents),
  status TEXT NOT NULL DEFAULT 'awaiting_payment' CHECK (status IN ('awaiting_payment','paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), paid_at TIMESTAMPTZ,
  aspire_transaction_id TEXT UNIQUE
);
CREATE TABLE IF NOT EXISTS ja_order_emails (
  id TEXT PRIMARY KEY, order_id UUID NOT NULL REFERENCES ja_orders(id),
  kind TEXT NOT NULL, audience TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ, attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ, last_error TEXT, first_attempt_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS ja_order_jobs (
  name TEXT PRIMARY KEY, locked_until TIMESTAMPTZ NOT NULL, owner UUID NOT NULL,
  last_success_at TIMESTAMPTZ, last_error TEXT
);
CREATE TABLE IF NOT EXISTS ja_payment_reviews (
  transaction_id TEXT PRIMARY KEY, reason TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ja_orders_pending_idx ON ja_orders (status, created_at);
CREATE TABLE IF NOT EXISTS ja_order_rate_limits (
  bucket TEXT PRIMARY KEY, attempts INTEGER NOT NULL DEFAULT 1, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
