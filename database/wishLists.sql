-- WishList table: products saved by users (favorites)
CREATE TABLE wishlist (
    user_id   INT NOT NULL,
    product_id INT NOT NULL,
    added_at  TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY(user_id, product_id),              -- Composite PK to ensure no duplicate wish item per user
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id)
        REFERENCES products(product_id) ON DELETE CASCADE
);
CREATE INDEX idx_wishlist_product ON wishlist(product_id);
COMMENT ON TABLE wishlist IS 'Wish list items saved by users (user-product pairs)';
