-- Roles table: defines user roles for access control
CREATE TABLE roles (
    role_id   SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE   -- e.g., 'customer', 'sales_manager', 'product_manager'
);
COMMENT ON TABLE roles IS 'User roles for access control (customer, sales_manager, product_manager)';

-- Users table: stores user account info (customers and managers)
CREATE TABLE users (
    user_id    SERIAL PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,        -- Email used for login (must be unique)
    password_hash TEXT NOT NULL,                    -- Password hash for authentication (store securely)
    name       VARCHAR(100) NOT NULL,               -- Full name of the user
    tax_id     VARCHAR(50),                         -- Tax ID (for invoicing purposes)
    role_id    INT NOT NULL REFERENCES roles(role_id) 
               ON DELETE RESTRICT,                 -- Role of the user (foreign key to roles)
    -- Optional: home_address_id INT REFERENCES addresses(address_id)
    -- We will use the addresses table for user addresses instead of a direct field
    CONSTRAINT fk_user_role FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
);
COMMENT ON TABLE users IS 'All user accounts (customers and managers) with login and profile info';

-- Addresses table: stores multiple addresses per user (shipping/home addresses)
CREATE TABLE addresses (
    address_id SERIAL PRIMARY KEY,
    user_id    INT NOT NULL,                        -- Owner of this address
    label      VARCHAR(50) DEFAULT 'Home',          -- Label for address (e.g., Home, Work)
    address_line VARCHAR(255) NOT NULL,             -- Full address line (could be split into street/city/etc. in real design)
    city       VARCHAR(100),
    state      VARCHAR(100),
    zip_code   VARCHAR(20),
    country    VARCHAR(50),
    CONSTRAINT fk_address_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE  -- If user is deleted, remove their addresses
);
CREATE INDEX idx_addresses_user ON addresses(user_id);
COMMENT ON TABLE addresses IS 'User addresses (one-to-many relationship with users)';
