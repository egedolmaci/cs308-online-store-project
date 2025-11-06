-- Product Reviews table: ratings and comments from customers for delivered products
CREATE TABLE product_reviews (
    review_id   SERIAL PRIMARY KEY,
    product_id  INT NOT NULL,
    user_id     INT NOT NULL,
    rating      INT NOT NULL CHECK (rating >= 1 AND rating <= 5),  -- Rating 1-5 stars
    comment     TEXT,                                              -- Optional comment
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,                    -- Comment approval status (by product manager)
    review_date TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_review_product FOREIGN KEY (product_id)
        REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT uq_review_user_product UNIQUE(user_id, product_id)   -- One review per user per product
);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);
COMMENT ON TABLE product_reviews IS 'Customer ratings (1-5) and comments on products (comments require approval)';
