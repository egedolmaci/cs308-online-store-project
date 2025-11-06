-- Delivery table: items to be delivered (shipping records)
CREATE TABLE delivery (
    delivery_id SERIAL PRIMARY KEY,
    order_id    INT NOT NULL,
    customer_id INT NOT NULL,
    product_id  INT NOT NULL,
    quantity    INT NOT NULL,
    total_price NUMERIC(10,2) NOT NULL CHECK(total_price >= 0),
    delivery_address TEXT NOT NULL,                  -- Shipping address for this delivery
    is_completed   BOOLEAN NOT NULL DEFAULT FALSE,   -- Has the delivery been completed?
    -- Foreign key to ensure (order_id, product_id) is a valid combination from order_items
    CONSTRAINT fk_delivery_order_item FOREIGN KEY(order_id, product_id)
        REFERENCES order_items(order_id, product_id) ON DELETE CASCADE,
    CONSTRAINT fk_delivery_customer FOREIGN KEY(customer_id)
        REFERENCES users(user_id) ON DELETE CASCADE
    -- Note: product_id and order_id are also implicitly linked via order_items
);
CREATE INDEX idx_delivery_order ON delivery(order_id);
COMMENT ON TABLE delivery IS 'Delivery list for orders: customer, product, quantity, address, and completion status';
