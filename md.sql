DROP DATABASE md;

CREATE DATABASE IF NOT EXISTS md;

USE md;

-- usersテーブルの作成
CREATE TABLE Users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    mailaddress VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- categoriesテーブルの作成
CREATE TABLE Categories (
    categoryId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

-- notesテーブルの作成
CREATE TABLE Notes (
    noteId INT AUTO_INCREMENT PRIMARY KEY,
    categoryId INT,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    lastedit TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (categoryId) REFERENCES Categories(CategoryId)
);