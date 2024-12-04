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
    name VARCHAR(50) NOT NULL,
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

-- Insert 70 sample data into roles table
-- Insert 70 unique roles into roles table
INSERT INTO roles (name, description) VALUES
-- Roles 1~10
('Viewer', '文書を閲覧のみできる'),
('Editor', '文書を閲覧および編集できる'),
('Admin', '文書を閲覧、編集、および権限を管理できる'),
('Owner', 'グループの完全な管理権限を持つ'),
('閲覧者', '文書を閲覧のみ可能'),
('編集者', '文書の編集が可能'),
('管理者', 'グループおよび文書の管理が可能'),
('Contributor', '文書を閲覧および新しい文書を追加できる'),
('Moderator', '文書を閲覧、編集、および削除できる'),
('Guest', '閲覧権限が制限されている'),
-- Roles 11~20
('Analyst', '文書を閲覧および分析できる'),
('寄稿者', '新しい文書を追加可能'),
('モデレーター', '文書の編集や削除が可能'),
('ゲスト', '閲覧権限が制限された利用者'),
('Manager', '文書を閲覧、編集、およびグループメンバーを管理できる'),
('Auditor', 'すべての文書および活動ログを閲覧できる'),
('Supervisor', '特定グループの監督が可能'),
('Specialist', '特定の領域で文書を管理できる'),
('監査人', '活動ログの確認が可能'),
('監督者', 'グループ全体を監督可能'),
-- Roles 21~30
('スペシャリスト', '特定の専門領域に特化'),
('Reviewer', '文書のレビューと承認が可能'),
('Approver', '文書を承認可能'),
('Planner', 'プロジェクトの計画が可能'),
('Operator', '操作や手順の実行が可能'),
('レビュアー', '文書のレビュー担当'),
('承認者', '文書の承認を担当'),
('計画者', 'プロジェクト計画の策定が可能'),
('Designer', 'デザイン作業が可能'),
('Tester', '文書のテストや検証が可能'),
-- Roles 31~40
('Trainer', 'トレーニング用文書を管理可能'),
('Observer', '活動の観察が可能'),
('デザイナー', 'デザイン関連の管理が可能'),
('テスター', '文書の検証を担当'),
('観察者', '活動の監視を担当'),
('Liaison', '連絡や調整が可能'),
('Supporter', '支援業務を担当'),
('Coordinator', '調整役を担当'),
('Executor', '実行担当者'),
('連絡者', '連絡調整役'),
-- Roles 41~50
('サポーター', '支援業務に特化'),
('コーディネーター', '調整役を務める'),
('Strategist', '戦略策定が可能'),
('Advisor', 'アドバイスが可能'),
('Innovator', '革新的な提案を担当'),
('Problem Solver', '問題解決を担当'),
('戦略家', '戦略的計画の立案が可能'),
('アドバイザー', '助言や提案が可能'),
('革新者', '新たな方法を模索'),
('問題解決者', '課題解決に注力'),
-- Roles 51~60
('Consultant', '専門的な助言を提供'),
('Technician', '技術的なサポートを提供'),
('Researcher', '研究および分析を担当'),
('Developer', 'ソフトウェアやシステムの開発を担当'),
('Engineer', 'エンジニアリングに特化'),
('Architect', '設計や構築を担当'),
('アーキテクト', '設計業務を管理'),
('開発者', '開発業務を担当'),
('研究者', '研究関連業務を担当'),
('技術者', '技術的な支援を提供'),
-- Roles 61~70
('Project Manager', 'プロジェクトの全体管理を担当'),
('Team Leader', 'チームをリードする役割'),
('Innovative Thinker', '新しいアイデアを提案'),
('Risk Manager', 'リスクの評価と管理'),
('プロジェクト管理者', 'プロジェクト全体を管理'),
('チームリーダー', 'チームの指導を担当'),
('革新的思考者', '新しい方法を模索'),
('リスク管理者', 'リスク評価を担当'),
('ファシリテーター', '会議や議論を円滑に進行'),
('ビジョナリー', '長期的な目標設定を担当');

-- Insert sample data into permissions table
INSERT INTO permissions (name, description) VALUES
('閲覧のみ', '文書を読む権限'),
('編集可能', '文書を作成、編集、削除する権限'),
('管理者', '文書の管理および設定の管理を行う権限');

-- Insert 70 roles for 10 groups into group_roles table
INSERT INTO group_roles (group_id, role_id) VALUES
-- Group 1
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7),
-- Group 2
(2, 8), (2, 9), (2, 10), (2, 11), (2, 12), (2, 13), (2, 14),
-- Group 3
(3, 15), (3, 16), (3, 17), (3, 18), (3, 19), (3, 20), (3, 21),
-- Group 4
(4, 22), (4, 23), (4, 24), (4, 25), (4, 26), (4, 27), (4, 28),
-- Group 5
(5, 29), (5, 30), (5, 31), (5, 32), (5, 33), (5, 34), (5, 35),
-- Group 6
(6, 36), (6, 37), (6, 38), (6, 39), (6, 40), (6, 41), (6, 42),
-- Group 7
(7, 43), (7, 44), (7, 45), (7, 46), (7, 47), (7, 48), (7, 49),
-- Group 8
(8, 50), (8, 51), (8, 52), (8, 53), (8, 54), (8, 55), (8, 56),
-- Group 9
(9, 57), (9, 58), (9, 59), (9, 60), (9, 61), (9, 62), (9, 63),
-- Group 10
(10, 64), (10, 65), (10, 66), (10, 67), (10, 68), (10, 69), (10, 70);

-- Insert sample data into role_permissions table
-- Insert role permissions for 70 roles
INSERT INTO role_permissions (role_id, permission_id) VALUES
-- Roles 1~10
(1, 1), (2, 2), (3, 2), (4, 3), (5, 1), (6, 2), (7, 1), (8, 2), (9, 2), (10, 1),
-- Roles 11~20
(11, 1), (12, 2), (13, 2), (14, 1), (15, 3), (16, 3), (17, 2), (18, 2), (19, 1), (20, 3),
-- Roles 21~30
(21, 2), (22, 1), (23, 3), (24, 2), (25, 2), (26, 1), (27, 3), (28, 2), (29, 2), (30, 1),
-- Roles 31~40
(31, 1), (32, 1), (33, 2), (34, 2), (35, 1), (36, 2), (37, 1), (38, 2), (39, 2), (40, 3),
-- Roles 41~50
(41, 1), (42, 2), (43, 3), (44, 3), (45, 2), (46, 2), (47, 3), (48, 2), (49, 2), (50, 3),
-- Roles 51~60
(51, 1), (52, 2), (53, 2), (54, 2), (55, 1), (56, 3), (57, 1), (58, 2), (59, 2), (60, 3),
-- Roles 61~70
(61, 1), (62, 2), (63, 3), (64, 2), (65, 3), (66, 1), (67, 2), (68, 1), (69, 3), (70, 2);

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
('研究結果:AIと医療', '医療におけるAIの研究結果...', 7, 4),
('法的要約:知的財産', '最近の知的財産関連の事例の要約...', 8, 6),
('経営概要:会社の方向性', '今後5年間の会社の方向性についての要約...', 9, 8),
('ITインフラのアップグレード計画', '会社のITインフラをアップグレードする計画...', 10, 10),
('Test Note', 'Thsi is test note...', 1, 1);