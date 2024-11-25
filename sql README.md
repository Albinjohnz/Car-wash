use car;

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL
);
INSERT INTO services (name, description, price) VALUES ('hai', 'ssss', 3511.00);
select * from services;
DESCRIBE services;
