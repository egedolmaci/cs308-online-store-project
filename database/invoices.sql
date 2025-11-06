-- Invoices table: billing invoices for orders
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    order_id   INT NOT NULL UNIQUE,                      -- Each order has at most one invoice
    invoice_date TIMESTAMP NOT NULL DEFAULT NOW(),
    total_amount NUMERIC(12,2) NOT NULL CHECK(total_amount >= 0),
    CONSTRAINT fk_invoice_order FOREIGN KEY (order_id)
        REFERENCES orders(order_id) ON DELETE CASCADE
);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
COMMENT ON TABLE invoices IS 'Invoices for orders (generated after payment confirmation)';
