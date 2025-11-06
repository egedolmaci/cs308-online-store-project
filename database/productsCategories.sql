-- Categories table: product categories (for organizing products)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE     -- e.g., "Electronics", "Clothing"
);
COMMENT ON TABLE categories IS 'Product categories (managed by product managers)';

-- Distributors table: stores distributor/supplier info for products
CREATE TABLE distributors (
    distributor_id SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE,       -- Distributor name
    contact_phone VARCHAR(50),
    contact_email VARCHAR(100)
);
COMMENT ON TABLE distributors IS 'Distributors or suppliers providing the products';

-- Products table: all products in the catalog with required properties
CREATE TABLE products (
    product_id    SERIAL PRIMARY KEY,
    category_id   INT NOT NULL,                              -- Category this product belongs to
    distributor_id INT,                                      -- Distributor/supplier of the product
    name          VARCHAR(200) NOT NULL,
    model         VARCHAR(100),
    serial_number VARCHAR(100),
    description   TEXT,
    quantity_in_stock INT NOT NULL CHECK (quantity_in_stock >= 0),  -- Current stock quantity (>= 0)
    price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),        -- Selling price
    cost          NUMERIC(10,2) NOT NULL CHECK (cost >= 0),         -- Cost price (for profit calculations)
    warranty_months INT CHECK (warranty_months >= 0),        -- Warranty period in months (if applicable)
    is_active     BOOLEAN DEFAULT TRUE,                      -- Whether product is active/available (for soft deletes)
    CONSTRAINT uq_product_serial UNIQUE (serial_number),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id)
        REFERENCES categories(category_id) ON DELETE RESTRICT,
    CONSTRAINT fk_product_distributor FOREIGN KEY (distributor_id)
        REFERENCES distributors(distributor_id) ON DELETE SET NULL
);
CREATE INDEX idx_products_category ON products(category_id);
COMMENT ON TABLE products IS 'Product listings with model, serial, stock, price, cost, warranty, distributor, etc.';
