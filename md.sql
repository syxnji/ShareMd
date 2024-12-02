drop database md;
create database md;
use md;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -- 仮account
-- CREATE TABLE Users (
--     userId INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(50) NOT NULL,
--     mailaddress VARCHAR(100) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL
-- );

-- Groups table
CREATE TABLE `groups` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Roles table (predefined roles)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
) ENGINE=InnoDB;

-- Permissions table
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
) ENGINE=InnoDB;

-- Group-specific Roles table
CREATE TABLE group_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT,
    role_id INT,
    UNIQUE(group_id, role_id),
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Role-Permission associations table
CREATE TABLE role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    permission_id INT,
    UNIQUE(role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- User-Group Memberships table
CREATE TABLE user_group_memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    group_id INT,
    role_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES group_roles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Notes table
CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    group_id INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Insert sample data into users table
INSERT INTO users (username, email, password_hash) VALUES
('john_doe', 'john@example.com', 'hashed_password_1'),
('jane_smith', 'jane@example.com', 'hashed_password_2'),
('bob_johnson', 'bob@example.com', 'hashed_password_3'),
('alice_williams', 'alice@example.com', 'hashed_password_4'),
('charlie_brown', 'charlie@example.com', 'hashed_password_5'),
('diana_ross', 'diana@example.com', 'hashed_password_6'),
('edward_norton', 'edward@example.com', 'hashed_password_7'),
('fiona_apple', 'fiona@example.com', 'hashed_password_8'),
('george_clooney', 'george@example.com', 'hashed_password_9'),
('helen_mirren', 'helen@example.com', 'hashed_password_10');

-- Insert sample data into groups table
INSERT INTO `groups` (name, description) VALUES
('Marketing Team', 'マーケティング関連の文書用グループ'),
('Development Team', '開発関連の文書用グループ'),
('HR Department', '人事関連の文書用グループ'),
('財務部門', '財務関連の文書用グループ'),
('営業チーム', '営業関連の文書用グループ'),
('カスタマーサポート', 'カスタマーサポート関連の文書用グループ'),
('研究チーム', '研究関連の文書用グループ'),
('法務部門', '法務関連の文書用グループ'),
('経営層チーム', '経営層向けの文書用グループ'),
('IT部門', 'IT関連の文書用グループ');

-- Insert sample data into roles table
INSERT INTO roles (name, description) VALUES
('Viewer', '文書を閲覧のみできる'),
('Editor', '文書を閲覧および編集できる'),
('Admin', '文書を閲覧、編集、および権限を管理できる'),
('Owner', 'グループの完全な管理権限を持つ'),
('Contributor', '文書を閲覧および新しい文書を追加できる'),
('Moderator', '文書を閲覧、編集、および削除できる'),
('Guest', '閲覧権限が制限されている'),
('Analyst', '文書を閲覧および分析できる'),
('Manager', '文書を閲覧、編集、およびグループメンバーを管理できる'),
('Auditor', 'すべての文書および活動ログを閲覧できる');

-- Insert sample data into permissions table
INSERT INTO permissions (id, name, description) VALUES
(1, '閲覧のみ', '文書を読む権限'),
(2, '編集可能', '文書を作成、編集、削除する権限'),
(3, '管理者', '文書の管理および設定の管理を行う権限');

-- Insert sample data into group_roles table
INSERT INTO group_roles (group_id, role_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 1), (2, 2), (2, 3), (2, 4),
(3, 1), (3, 2);

-- Insert sample data into role_permissions table
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (2, 1), (2, 2), (3, 1), (3, 2), (3, 3),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6),
(5, 1), (5, 2), (6, 1), (6, 2), (6, 3),
(7, 1), (8, 1), (8, 9), (9, 1), (9, 2), (9, 6);

-- Insert sample data into user_group_memberships table
INSERT INTO user_group_memberships (user_id, group_id, role_id) VALUES
(1, 1, 1), (2, 1, 2), (3, 2, 1), (4, 2, 2),
(5, 3, 1), (6, 3, 2), (7, 4, 1), (8, 4, 2),
(9, 5, 1), (10, 5, 2),
(1, 2, 1),(1, 3, 1),(1, 4, 1);

-- Insert sample data into notes table
INSERT INTO notes (title, content, group_id, created_by) VALUES
('Marketing Strategy 2023', 'Content for marketing strategy...', 1, 1),
('Q2 Development Roadmap', 'Roadmap for Q2 development...', 2, 3),
('Employee Handbook', 'Content of employee handbook...', 3, 5),
('Financial Report 2023', 'Annual financial report details...', 4, 7),
('Sales Targets Q3', 'Sales targets for Q3...', 5, 9),
('顧客フィードバック分析', '最近の顧客フィードバックの分析...', 6, 2),
('研究結果：AIと医療', '医療におけるAIの研究結果...', 7, 4),
('法的要約：知的財産', '最近の知的財産関連の事例の要約...', 8, 6),
('経営概要：会社の方向性', '今後5年間の会社の方向性についての要約...', 9, 8),
('ITインフラのアップグレード計画', '会社のITインフラをアップグレードする計画...', 10, 10),
('Test Note', 'Thsi is test note...', 1, 1);