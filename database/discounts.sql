-- Discounts table: active discounts on products (managed by sales managers)
CREATE TABLE discounts (
    discount_id SERIAL PRIMARY KEY,
    product_id  INT NOT NULL UNIQUE,                    -- Product on discount (one active discount per product)
    discount_percent INT NOT NULL CHECK(discount_percent BETWEEN 0 AND 100),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date   DATE,                                    -- Optional end date for the discount period
    created_by INT NOT NULL,                            -- Sales manager who set the discount
    CONSTRAINT fk_discount_product FOREIGN KEY (product_id)
        REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_discount_manager FOREIGN KEY (created_by)
        REFERENCES users(user_id) ON DELETE SET NULL
);
CREATE INDEX idx_discounts_product ON discounts(product_id);
COMMENT ON TABLE discounts IS 'Product discounts (percentage off) set by sales managers';
