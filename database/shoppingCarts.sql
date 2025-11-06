-- Carts table: one cart per user (holds cart metadata)
CREATE TABLE carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,                     -- Each user has one cart
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE
);
COMMENT ON TABLE carts IS 'Shopping cart for each user (holds relationship to cart items)';

-- Cart Items table: items added to shopping carts
CREATE TABLE cart_items (
    cart_id   INT NOT NULL,
    product_id INT NOT NULL,
    quantity  INT NOT NULL CHECK (quantity > 0),    -- Quantity of the product in the cart
    PRIMARY KEY(cart_id, product_id),               -- Composite PK: each product appears once per cart
    CONSTRAINT fk_cartitem_cart FOREIGN KEY (cart_id)
        REFERENCES carts(cart_id) ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_product FOREIGN KEY (product_id)
        REFERENCES products(product_id) ON DELETE CASCADE
);
CREATE INDEX idx_cartitems_product ON cart_items(product_id);
COMMENT ON TABLE cart_items IS 'Items in shopping carts, linking products to a users cart with quantities';
