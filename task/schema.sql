CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATETIME
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  serial_number VARCHAR(100) NOT NULL UNIQUE,
  is_new TINYINT(1) DEFAULT 1,
  photo VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  type ENUM('monitor','tv','smartphone','laptop','tablet') NOT NULL,
  specification TEXT NOT NULL,
  guarantee_start DATETIME,
  guarantee_end DATETIME,
  price JSON,
  order_id INT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_products (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  PRIMARY KEY(order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);