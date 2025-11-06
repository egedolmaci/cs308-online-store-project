-- Returns table: tracks product return/refund requests
CREATE TABLE returns (
    return_id    SERIAL PRIMARY KEY,
    order_item_id INT NOT NULL,                              -- The specific order item being returned
    order_id     INT NOT NULL,
    product_id   INT NOT NULL,
    quantity_returned INT NOT NULL CHECK(quantity_returned > 0),
    status       VARCHAR(20) NOT NULL DEFAULT 'pending',     -- 'pending', 'approved', or 'rejected'
    request_date TIMESTAMP NOT NULL DEFAULT NOW(),
    refund_amount NUMERIC(10,2) NOT NULL CHECK(refund_amount >= 0),  -- Amount to refund for this return
    processed_by INT,                                        -- Sales manager who approved/rejected the return
    CONSTRAINT fk_return_order_item FOREIGN KEY(order_item_id)
        REFERENCES order_items(order_item_id) ON DELETE CASCADE,
    CONSTRAINT fk_return_order_item_comp FOREIGN KEY(order_id, product_id)
        REFERENCES order_items(order_id, product_id) ON DELETE CASCADE,
    CONSTRAINT fk_return_manager FOREIGN KEY(processed_by)
        REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT uq_return_item UNIQUE(order_item_id)
);
CREATE INDEX idx_returns_status ON returns(status);
COMMENT ON TABLE returns IS 'Return/refund requests for delivered order items (handled by sales managers)';
