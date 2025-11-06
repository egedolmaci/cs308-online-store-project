-- Orders table: customer orders (purchase transactions)
CREATE TABLE orders (
    order_id   SERIAL PRIMARY KEY,
    user_id    INT NOT NULL,                                   -- Customer who placed the order
    order_date TIMESTAMP NOT NULL DEFAULT NOW(),
    status     VARCHAR(20) NOT NULL DEFAULT 'processing',      -- Order status
    CONSTRAINT chk_order_status CHECK (status IN ('processing','in_transit','delivered','canceled')),
    CONSTRAINT fk_order_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE           -- If user is deleted, delete their orders (may not be ideal in production)
);
CREATE INDEX idx_orders_user ON orders(user_id);
COMMENT ON TABLE orders IS 'Orders placed by customers (status: processing, in_transit, delivered, canceled)';

-- Order Items table: line items for each order
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id   INT NOT NULL,
    product_id INT NOT NULL,
    quantity   INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),  -- Price per unit at time of order
    unit_cost  NUMERIC(10,2) NOT NULL CHECK (unit_cost >= 0),   -- Cost per unit at time of order (for profit calculation)
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id)
        REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id)
        REFERENCES products(product_id) ON DELETE RESTRICT,
    CONSTRAINT uq_orderitem_product UNIQUE(order_id, product_id)  -- Prevent duplicate product lines in same order
);
CREATE INDEX idx_orderitems_order ON order_items(order_id);
CREATE INDEX idx_orderitems_product ON order_items(product_id);
COMMENT ON TABLE order_items IS 'Line items for orders, including product, quantity, price, and cost';
