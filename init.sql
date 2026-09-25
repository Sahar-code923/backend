CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    category   VARCHAR(50),
    price      DECIMAL(10, 2),
    stock      INT
);

INSERT INTO products (name, category, price, stock) VALUES
('Wireless Mouse',      'Electronics', 1499.00, 50),
('Mechanical Keyboard', 'Electronics', 5999.00, 30),
('Notebook',            'Stationery',   250.00, 200),
('Water Bottle',        'Accessories',  799.00, 75),
('Desk Lamp',           'Home',        2199.00, 40);
