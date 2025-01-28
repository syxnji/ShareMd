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
            case 'leaveGroup':
                const { groupId, userId } = params;
                await connection.execute(
                    'UPDATE user_group_memberships SET \`delete\` = 1 WHERE group_id = ? AND user_id = ?',
                    [groupId, userId]
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