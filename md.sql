DROP DATABASE md;

CREATE DATABASE IF NOT EXISTS md;

USE md;

CREATE TABLE User (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) NOT NULL,
    Mailaddress VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL
);

INSERT INTO User (Username, Mailaddress, Password) VALUES
    ('山田太郎', 'yamada@example.com', 'password123'),
    ('鈴木花子', 'suzuki@example.com', 'hanako456'),
    ('佐藤一郎', 'sato@example.com', 'ichiro789');
