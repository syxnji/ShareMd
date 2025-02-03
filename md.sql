drop database md;
create database md;
use md;

-- MARK: ユーザー
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `delete` BOOLEAN DEFAULT 0
) ENGINE=InnoDB;

-- MARK: INS ユーザー
INSERT INTO users (username, email, password_hash) VALUES
('john_doe', 'john@mail.com', '$2a$10$N/SRaU0r6gg6SWZOK6ipJuijmxnP9fdGqGAqWOCPrrP9e7MSLhwU2'),
('jane_smith', 'jane@mail.com', '$2a$10$N/SRaU0r6gg6SWZOK6ipJuijmxnP9fdGqGAqWOCPrrP9e7MSLhwU2'),
('bob_johnson', 'bob@mail.com', '$2a$10$N/SRaU0r6gg6SWZOK6ipJuijmxnP9fdGqGAqWOCPrrP9e7MSLhwU2'),
('alice_williams', 'alice@mail.com', '$2a$10$N/SRaU0r6gg6SWZOK6ipJuijmxnP9fdGqGAqWOCPrrP9e7MSLhwU2'),
('charlie_brown', 'charlie@mail.com', '$2a$10$N/SRaU0r6gg6SWZOK6ipJuijmxnP9fdGqGAqWOCPrrP9e7MSLhwU2'),
('diana_ross', 'diana@mail.com', '$2a$10$N/SRaU0r6gg6SWZOK6ipJuijmxnP9fdGqGAqWOCPrrP9e7MSLhwU2'),
('edward_norton', 'edward@mail.com', '$2a$10$N/SRaU0r6gg6SWZOK6ipJuijmxnP9fdGqGAqWOCPrrP9e7MSLhwU2'),
('fiona_apple', 'fiona@mail.com', '$2a$10$N/SRaU0r6gg6SWZOK6ipJuijmxnP9fdGqGAqWOCPrrP9e7MSLhwU2'),
('george_clooney', 'george@mail.com', '$2a$10$N/SRaU0r6gg6SWZOK6ipJuijmxnP9fdGqGAqWOCPrrP9e7MSLhwU2'),
('helen_mirren', 'helen@mail.com', '$2a$10$N/SRaU0r6gg6SWZOK6ipJuijmxnP9fdGqGAqWOCPrrP9e7MSLhwU2');

-- MARK: 通知
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    sender_id INT,
    group_id INT,
    type_id INT,
    response TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `delete` BOOLEAN DEFAULT 0
) ENGINE=InnoDB;

-- MARK: 通知タイプ
CREATE TABLE notification_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    `delete` BOOLEAN DEFAULT 0
) ENGINE=InnoDB;

-- MARK: INS 通知タイプ
INSERT INTO notification_types (name, description) VALUES
('request', 'グループに参加リクエストがあった場合に通知されます'),
('invite', 'グループに招待された場合に通知されます'),
('accept', 'グループに参加承認があった場合に通知されます'),
('reject', 'グループに参加拒否があった場合に通知されます');

-- MARK: グループ
CREATE TABLE `groups` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INT,
    category ENUM('personal', 'shared') DEFAULT 'shared',
    level enum('private', 'public') DEFAULT 'private',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `delete` BOOLEAN DEFAULT 0
) ENGINE=InnoDB;

-- MARK: INS グループ
INSERT INTO `groups` (name, created_by, category, level) VALUES
-- 1
('Marketing Team', 1, 'shared', 'public'),
('Development Team',  2, 'shared', 'public'),
('HR Department', 3, 'shared', 'public'),
('財務部門', 4, 'shared', 'public'),
('営業チーム', 5, 'shared', 'public'),
-- 6
('カスタマーサポート', 6, 'shared', 'public'),
('研究チーム', 7, 'shared', 'public'),
('法務部門', 8, 'shared', 'public'),
('経営層チーム', 9, 'shared', 'public'),
('IT部門', 10, 'shared', 'public'),
-- 11
('サポート', 1, 'shared', 'public'),
('PERSONAL', 1, 'personal', 'private'),
('PERSONAL', 2, 'personal', 'private'),
('PERSONAL', 3, 'personal', 'private'),
('PERSONAL', 4, 'personal', 'private'),
-- 16
('PERSONAL', 5, 'personal', 'private'),
('PERSONAL', 6, 'personal', 'private'),
('PERSONAL', 7, 'personal', 'private'),
('PERSONAL', 8, 'personal', 'private'),
('PERSONAL', 9, 'personal', 'private'),
-- 21
('PERSONAL', 10, 'personal', 'private');

-- MARK: 役職
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    `delete` BOOLEAN DEFAULT 0
) ENGINE=InnoDB;

-- MARK: INS 役職
INSERT INTO roles (name, description) VALUES 
-- グループ作成者 1 2
('創設者', 'グループを作成したユーザー'),
('デフォルト', 'デフォルトの役職'),
-- マーケティング 3 4 5
('担当者', 'マーケティング関連の業務を担当'),
('キャンペーンリーダー', 'マーケティングキャンペーンのリーダー'),
('アナリスト', 'マーケティング分析業務を担当'),
-- 開発 6 7 8
('ジュニア開発者', '開発業務のサポート'),
('シニア開発者', '高度な開発業務を担当'),
('リーダー', '開発チームのリーダー'),
-- 人事 9 10 11
('人事担当者', '人事業務を担当'),
('採用担当者', '採用活動を担当'),
('人事マネージャー', '人事部門のマネジメント'),
-- 財務 12 13 14
('財務担当者', '財務業務を担当'),
('財務アナリスト', '財務データの分析業務を担当'),
('財務マネージャー', '財務部門の管理'),
-- 営業 15 16 17
('営業担当者', '営業活動を担当'),
('営業マネージャー', '営業チームのマネジメント'),
('アカウントマネージャー', 'クライアントとの関係を管理'),
-- カスタマーサポート 18 19 20
('サポートスタッフ', 'カスタマーサポート業務を担当'),
('サポートリーダー', 'サポートチームのリーダー'),
('カスタマーサポートマネージャー', 'カスタマーサポート部門の管理'),
-- 研究 21 22 23
('研究者', '研究業務を担当'),
('シニア研究者', '高度な研究業務を担当'),
('リサーチリーダー', '研究チームのリーダー'),
-- 法務 24 25 26
('法務担当者', '法務業務を担当'),
('法務アドバイザー', '法務に関するアドバイスを提供'),
('法務マネージャー', '法務部門の管理'),
-- 経営 27 28 29
('経営陣', '経営層の業務を担当'),
('経営アシスタント', '経営陣のサポート業務'),
('経営マネージャー', '経営部門の管理'),
-- IT 30 31 32
('CEO', '最高経営責任者'),
('CFO', '最高財務責任者'),
('COO', '最高執行責任者'),
-- サポート 33 34 35
('ITサポート', 'ITサポート業務を担当'),
('システムエンジニア', 'システム開発および管理業務を担当'),
('ITマネージャー', 'IT部門の管理');

-- MARK: 権限
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    `delete` BOOLEAN DEFAULT 0
) ENGINE=InnoDB;

-- MARK: INS 権限
INSERT INTO permissions (name, description) VALUES
('管理者', '文書の管理および設定の管理を行う権限'),
('編集可能', '文書を作成、編集、削除する権限'),
('閲覧のみ', '文書を読む権限');

-- MARK: グループごとの役職
CREATE TABLE group_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT,
    role_id INT,
    UNIQUE(group_id, role_id),
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    `delete` BOOLEAN DEFAULT 0
) ENGINE=InnoDB;

-- MARK: INS グループごとのロール
INSERT INTO group_roles (group_id, role_id) VALUES
-- マーケティング
(1,1),(1,2), (1, 3), (1, 4), (1, 5),
-- 開発
(2,1),(2,2), (2, 6), (2, 7), (2, 8),
-- 人事
(3,1),(3,2), (3, 9), (3, 10), (3, 11),
-- 財務
(4,1),(4,2), (4, 12), (4, 13), (4, 14),
-- 営業
(5,1),(5,2), (5, 15), (5, 16), (5, 17),
-- カスタマーサポート
(6,1),(6,2), (6, 18), (6, 19), (6, 20),
-- 研究
(7,1),(7,2), (7, 21), (7, 22), (7, 23),
-- 法務
(8,1),(8,2), (8, 24), (8, 25), (8, 26),
-- 経営
(9,1),(9,2), (9, 27), (9, 28), (9, 29),
-- IT
(10,1),(10,2), (10, 30), (10, 31), (10, 32),
-- サポート
(11,1),(11,2), (11, 33), (11, 34), (11, 35),
-- personal
(12,1),(12,2),(13,1),(13,2),(14,1),(14,2),
(15,1),(15,2),(16,1),(16,2),(17,1),(17,2),
(18,1),(18,2),(19,1),(19,2),(20,1),(20,2),
(21,1),(21,2);

-- MARK: 役職ごとの権限
CREATE TABLE role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    permission_id INT,
    UNIQUE(role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    `delete` BOOLEAN DEFAULT 0
) ENGINE=InnoDB;

-- MARK: INS 役職ごとの権限
INSERT INTO role_permissions (role_id, permission_id) VALUES
-- デフォルト
(1, 1), (2, 3),
-- グループ作成者
(3, 1),(4, 2),(5, 3),
-- マーケティング
(6, 1),(7, 2),(8, 3),
-- 開発
(9, 1),(10, 2),(11, 3),
-- 人事
(12, 1),(13, 2),(14, 3),
-- 財務
(15, 1),(16, 2),(17, 3),
-- 営業
(18, 1),(19, 2),(20, 3),
-- カスタマーサポート
(21, 1),(22, 2),(23, 3),
-- 研究
(24, 1),(25, 2),(26, 3),
-- 法務
(27, 1),(28, 2),(29, 3),
-- 経営
(30, 1),(31, 2),(32, 3),
-- IT
(33, 1),(34, 2),(35, 3);

-- MARK: ユーザーごとのグループ
CREATE TABLE user_group_memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    group_id INT,
    role_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `delete` BOOLEAN DEFAULT 0,
    UNIQUE(user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES group_roles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- MARK: INS ユーザーごとのグループ
INSERT INTO user_group_memberships (user_id, group_id, role_id) VALUES
-- 1~3
(1, 1, 1), (1, 2, 2), (1, 3, 2),
(2, 1, 2), (2, 2, 1), (2, 3, 2),
(3, 1, 2), (3, 2, 2), (3, 3, 1),
-- 4~6
(4, 4, 1), (4, 5, 2), (4, 6, 2),
(5, 4, 2), (5, 5, 1), (5, 6, 2),
(6, 4, 2), (6, 5, 2), (6, 6, 1),
-- 7~9
(7, 7, 1), (7, 8, 2), (7, 9, 2),
(8, 7, 2), (8, 8, 1), (8, 9, 2),
(9, 7, 2), (9, 8, 2), (9, 9, 1),
-- 10
(10, 10, 1),
-- 11
(1, 11, 1), (2, 11, 2), (3, 11, 2),
(4, 11, 2), (5, 11, 2), (6, 11, 2),
(7, 11, 2), (8, 11, 2), (9, 11, 2),
(10, 11, 1),
-- private
(1, 12, 1), (2, 13, 1), (3, 14, 1),
(4, 15, 1), (5, 16, 1), (6, 17, 1),
(7, 18, 1), (8, 19, 1), (9, 20, 1),
(10, 21, 1);

-- MARK: ノート
CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    group_id INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `delete` BOOLEAN DEFAULT 0,
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- MARK: INS ノート
INSERT INTO notes (title, content, group_id, created_by) VALUES
('Marketing Strategy 2023', 'Content for marketing strategy...', 1, 1),
('Q2 Development Roadmap', 'Roadmap for Q2 development...', 2, 3),
('Employee Handbook', 'Content of employee handbook...', 3, 5),
('Financial Report 2023', 'Annual financial report details...', 4, 7),
('Sales Targets Q3', 'Sales targets for Q3...', 5, 9),
('顧客フィードバック分析', '最近の顧客フィードバックの分析...', 6, 2),
('研究結果:AIと医療', '医療におけるAIの研究結果...', 7, 4),
('法的要約:知的財産', '最近の知的財産関連の事例の要約...', 8, 6),
('経営概要:会社の方向性', '今後5年間の会社の方向性についての要約...', 9, 8),
('ITインフラのアップグレード計画', '会社のITインフラをアップグレードする計画...', 10, 10),
('Test Note', 'Thsi is test note...', 1, 1);

SELECT * FROM group_roles;
SELECT * FROM groups;
SELECT * FROM notes;
SELECT * FROM notification_types;
SELECT * FROM notifications;
SELECT * FROM permissions;
SELECT * FROM role_permissions;
SELECT * FROM roles;
SELECT * FROM user_group_memberships;
SELECT * FROM users;

show tables;