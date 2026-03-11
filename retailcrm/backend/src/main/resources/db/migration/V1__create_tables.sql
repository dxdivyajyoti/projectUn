-- Users (store owners / staff)
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    store_name  VARCHAR(255),
    role        VARCHAR(50) DEFAULT 'OWNER',
    created_at  TIMESTAMP DEFAULT now()
);

-- Customers
CREATE TABLE customers (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name     VARCHAR(255) NOT NULL,
    phone         VARCHAR(50),
    email         VARCHAR(255),
    birthday      DATE,
    tag           VARCHAR(50) DEFAULT 'NEW',
    notes         TEXT,
    last_visited  TIMESTAMP,
    created_at    TIMESTAMP DEFAULT now()
);

-- Interactions (purchase history / notes)
CREATE TABLE interactions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id  UUID REFERENCES customers(id) ON DELETE CASCADE,
    type         VARCHAR(50),
    note         TEXT,
    amount       DECIMAL(10,2),
    created_at   TIMESTAMP DEFAULT now()
);

-- Reminders
CREATE TABLE reminders (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id  UUID REFERENCES customers(id) ON DELETE CASCADE,
    user_id      UUID REFERENCES users(id),
    note         TEXT,
    due_date     TIMESTAMP NOT NULL,
    completed    BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMP DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_interactions_customer_id ON interactions(customer_id);
CREATE INDEX idx_reminders_due ON reminders(user_id, due_date, completed);
