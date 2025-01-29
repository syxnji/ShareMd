import mysql from 'mysql2/promise'

// データベース接続設定
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const { table, ...params } = req.body;

        switch (table) {
            // MARK: leaveGroup
            case 'leaveGroup':
                await connection.execute(
                    `UPDATE user_group_memberships
                     SET \`delete\` = 1
                     WHERE group_id = ? 
                     AND user_id = ?;`,
                    [params.groupId, params.userId]
                );
                break;

            // MARK: changeRole
            case 'changeRole':
                // const { groupId, userId, roleId } = params;
                await connection.execute(
                    `UPDATE user_group_memberships
                     SET role_id = ?
                     WHERE user_id = ? 
                     AND group_id = ?;`,
                    [params.roleId, params.userId, params.groupId]
                );
                break;

            // MARK: deleteMember
            case 'deleteMember':
                await connection.execute(
                    `UPDATE user_group_memberships
                     SET \`delete\` = 1
                     WHERE user_id = ? 
                     AND group_id = ?;`,
                    [params.userId, params.groupId]
                );
                break;

            // MARK: deleteNote
            case 'deleteNote':
                await connection.execute(
                    `UPDATE notes
                     SET \`delete\` = 1
                     WHERE id = ?;`,
                    [params.id]
                );
                break;

            // MARK: updateRoleName
            case 'updateRoleName':
                await connection.execute(
                    `UPDATE roles
                     SET name = ?
                     WHERE id = ?;`,
                    [params.roleName, params.roleId]
                );
                break;

            // MARK: updateRoleToPermit
            case 'updateRoleToPermit':
                await connection.execute(
                    `UPDATE role_permissions
                     SET permission_id = ?
                     WHERE role_id = ?;`,
                    [params.permitId, params.roleId]
                );
                break;

            // MARK: deleteRole
            case 'deleteRole':
                await connection.execute(
                    `UPDATE roles
                     SET \`delete\` = 1
                     WHERE id = ?;`,
                    [params.roleId]
                );
                break;

            // MARK: acceptRequest
            case 'acceptRequest':
                await connection.execute(
                    `UPDATE notifications
                     SET response = 1
                     WHERE id = ?;`,
                    [params.notificationId]
                );
                break;

            // MARK: rejectRequest
            case 'rejectRequest':
                await connection.execute(
                    `UPDATE notifications
                     SET response = 2
                     WHERE id = ?;`,
                    [params.notificationId]
                );
                break;

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

        await connection.end();
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('PATCH Error:', error);
        return res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}