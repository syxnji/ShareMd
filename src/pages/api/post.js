import mysql from 'mysql2/promise';

// データベース接続設定
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const { table, ...params } = req.body;

        switch (table) {
            // MARK: createNote
            case 'createNote':
                const [createNoteResults] = await connection.execute(
                    `INSERT INTO notes (group_id, title, content, created_by)
                     VALUES (?, ?, ?, ?);`,
                    [params.groupId, params.title, params.content, params.userId]
                );
                await connection.end();
                return res.status(200).json({ success: true, noteId: createNoteResults.insertId });

            // MARK: inviteGroup
            case 'inviteGroup':
                await connection.execute(
                    `INSERT INTO notifications (user_id, sender_id, group_id, type_id)
                     VALUES (?, ?, ?, 2);`,
                    [params.inviteUserId, params.userId, params.groupId]
                );
                await connection.end();
                return res.status(200).json({ success: true });

            // MARK: addRole
            case 'addRole':
                const [addRoleResults] = await connection.execute(
                    `INSERT INTO roles (name) VALUES (?)`,
                    [params.roleName]
                );
                const roleId = addRoleResults.insertId;
                await connection.execute(
                    `INSERT INTO group_roles (group_id, role_id) VALUES (?, ?)`,
                    [params.groupId, roleId]
                );
                await connection.execute(
                    `INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)`,
                    [roleId, params.permissionId]
                );
                await connection.end();
                return res.status(200).json({ success: true });

            // MARK: requestGroup
            case 'requestGroup':
                await connection.execute(
                    `INSERT INTO notifications (user_id, sender_id, group_id, type_id) VALUES (?, ?, ?, 1);`,
                    [params.toUserId, params.fromUserId, params.groupId]
                );
                await connection.end();
                return res.status(200).json({ success: true });

            // MARK: createGroup
            case 'createGroup':
                const [createGroupResults] = await connection.execute(
                    `INSERT INTO \`groups\` (name, created_by) VALUES (?, ?);`,
                    [params.name, params.userId]
                );
                const groupId = createGroupResults.insertId;
                await connection.execute(
                    `INSERT INTO group_roles (group_id, role_id) VALUES (?, 1), (?, 2);`,
                    [groupId, groupId]
                );
                const userId = parseInt(params.userId);
                // メンバー分の処理
                for (const memberId of params.memberIds) {
                    if (memberId === userId) {
                        // 作成者はグループに参加
                        await connection.execute(
                            `INSERT INTO user_group_memberships (user_id, group_id, role_id) VALUES (?, ?, 1);`,
                            [memberId, groupId]
                        );
                    } else {
                        // その他のメンバーは招待通知
                        await connection.execute(
                            `INSERT INTO notifications (user_id, sender_id, group_id, type_id) VALUES (?, ?, ?, 2);`,
                            [memberId, params.userId, groupId]
                        );
                    }
                }
                await connection.end();
                return res.status(200).json({ success: true });

            // MARK: joinGroup
            case 'joinGroup':
                await connection.execute(
                    `INSERT INTO user_group_memberships (user_id, group_id, role_id)
                     VALUES (?, ?, 2) ON DUPLICATE KEY UPDATE \`delete\` = 0;`,
                    [params.inviteUserId, params.groupId]
                );
                await connection.end();
                return res.status(200).json({ success: true });

            // MARK: register
            case 'register':
                // ユーザー登録
                const [registerResults] = await connection.execute(
                    `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?);`,
                    [params.username, params.email, params.password]
                );
                // デフォルトグループ作成
                const [personalGroupResults] = await connection.execute(
                    `INSERT INTO \`groups\` (name, created_by, category, level) VALUES ('PERSONAL', ?, 'personal', 'private');`,
                    [registerResults.insertId]
                );
                // デフォルトグループにユーザーを追加
                await connection.execute(
                    `INSERT INTO user_group_memberships (user_id, group_id, role_id) VALUES (?, ?, 1);`,
                    [registerResults.insertId, personalGroupResults.insertId]
                );
                await connection.end();
                return res.status(200).json({ success: true });

            // case 'updateUserProfile':
            //     const { userId: profileUserId, name, bio } = params;
            //     await connection.execute(
            //         'UPDATE users SET name = ?, bio = ? WHERE id = ?',
            //         [name, bio, profileUserId]
            //     );
            //     break;

            default:
                await connection.end();
                return res.status(400).json({ message: '無効なテーブル名です' });
        }

    } catch (error) {
        console.error('PATCH Error:', error);
        return res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}
