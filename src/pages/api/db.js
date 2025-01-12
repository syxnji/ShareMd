import mysql from 'mysql2';
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'P@ssw0rd',
  database: 'md',
});

// APIリクエストのハンドリング
export default function handler(req, res) {
    // MARK: 新規登録
    if (req.query.table === 'register') {
        const username = req.query.username;
        const email = req.query.email;
        const password = req.query.password;
        pool.query(
            `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?);`,
            [username, email, password],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: ログイン
    } else if (req.query.table === 'login') {
        const email = req.query.email;
        pool.query(
            `SELECT * FROM users WHERE email = ?;`,
            [email],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: ユーザー情報
    } else if (req.query.table === 'userInfo') {
        const userId = req.query.userId;
        pool.query(
            `SELECT * FROM users WHERE id = ?;`,
            [userId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: 通知
    } else if (req.query.table === 'notifications') {
        const userId = req.query.userId;
        pool.query(
            `SELECT notifications.*, users.username, groups.name 
             FROM notifications 
             JOIN users ON notifications.user_id = users.id 
             JOIN \`groups\` ON notifications.group_id = \`groups\`.id 
             WHERE user_id = ? AND response = 0;`,
            [userId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: 通知の承認
    } else if (req.query.table === 'acceptRequest') {
        const notificationId = req.query.notificationId;
        pool.query(
            `UPDATE notifications SET response = 1 WHERE id = ?;`,
            [notificationId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: 通知の拒否
    } else if (req.query.table === 'rejectRequest') {
        const notificationId = req.query.notificationId;
        pool.query(
            `UPDATE notifications SET response = 2 WHERE id = ?;`,
            [notificationId],
            (err, results) => { 
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: デフォルトグループ
    } else if (req.query.table === 'defaultGroup') {
        const userId = req.query.userId;
        console.log('userId', userId);

        pool.query(
            `INSERT INTO \`groups\` (name, created_by) VALUES ('プライベート', ?);`,
            [userId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                    const groupId = results.insertId;

                    pool.query(
                        `INSERT INTO user_group_memberships (user_id, group_id) VALUES (?, ?);`,
                        [userId, groupId],
                        (err, results) => {
                            if (err) {
                                res.status(500).json({ error: err.message });
                            } else {
                                res.status(200).json({ results });

                                pool.query(
                                    `INSERT INTO group_roles (group_id, role_id) VALUES (?, 1), (?, 2);`,
                                    [groupId, groupId],
                                    (err, results) => {
                                        if (err) {
                                            res.status(500).json({ error: err.message });
                                        } else {
                                            res.status(200).json({ results });
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );
    // MARK: 参加しているグループ
    } else if (req.query.table === 'joinedGroups') {
        const userId = req.query.userId;
        pool.query(
            `SELECT groups.id, name 
             FROM \`groups\` 
             JOIN user_group_memberships 
               ON groups.id = user_group_memberships.group_id 
             WHERE user_group_memberships.user_id = ? AND groups.delete = 0 AND user_group_memberships.delete = 0
            `, [userId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json(results);
                }
            }
        );
    // MARK: 権限チェック
    } else if (req.query.table === 'checkPermission') {
        const userId = req.query.userId;
        pool.query(
            `SELECT user_group_memberships.id, 
             user_group_memberships.user_id,
             user_group_memberships.group_id, 
             user_group_memberships.role_id, 
             role_permissions.permission_id
             FROM user_group_memberships 
             JOIN role_permissions 
             ON user_group_memberships.role_id = role_permissions.role_id 
             WHERE user_group_memberships.user_id = ?;`
             , [userId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: グループ退会
    } else if (req.query.table === 'leaveGroup') {
        const groupId = req.query.groupId;
        const userId = req.query.userId;
        pool.query(
            `UPDATE user_group_memberships
             SET \`delete\` = 1
             WHERE group_id = ? AND user_id = ?
            `, [groupId, userId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: 全てのノート
    } else if (req.query.table === 'allNotes') {
        const userId = req.query.userId;
        pool.query(
            `SELECT notes.id, notes.title, notes.content, notes.updated_at, groups.name
             FROM notes 
             JOIN \`groups\` 
               ON notes.group_id = groups.id
             JOIN user_group_memberships
               ON notes.group_id = user_group_memberships.group_id
             WHERE user_id = ? AND notes.delete = 0
            `, [userId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json(results);
                }
            }
        );
    // MARK: 選択したグループのノート
    } else if (req.query.table === 'selectedGroup') {
        const selectGroupId = req.query.groupId;
        pool.query(
            `SELECT notes.id, notes.title, notes.content, notes.updated_at, 
             groups.id AS groupId, groups.name AS groupName
             FROM notes
             JOIN \`groups\`
               ON notes.group_id = groups.id
             WHERE notes.group_id = ? AND notes.delete = 0
            `, [selectGroupId], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json(results);
                }
            }
        );
    // MARK: 選択したノートのグループ
    } else if (req.query.table === 'group') {
        const id = req.query.id;
        pool.query(
            `select groups.id, groups.name 
             from notes
             join \`groups\` 
             on notes.group_id = groups.id 
             where notes.id = ? ;
            `, [id], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: グループのノート
    } else if (req.query.table === 'notes') {
        const id = req.query.id;
        pool.query(
            `SELECT notes.id, notes.title
             FROM \`groups\`
             JOIN notes
             ON groups.id = notes.group_id
             WHERE groups.id = ? AND notes.delete = 0
            `, [id], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: 選択したノート
    } else if (req.query.table === 'note') {
        const id = req.query.id;
        pool.query(
            `SELECT *
             FROM notes
             WHERE notes.id = ?
            `, [id], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: ノートの更新
    } else if (req.query.table === 'updateNote') {
        const id = req.query.id;
        const title = req.query.title;
        const content = encodeURIComponent(req.query.content);
        pool.query(
            `UPDATE notes
             SET 
             title = ?,
             content = ?,   
             updated_at = NOW()
             WHERE id = ?;
            `, [title, decodeURIComponent(content), id], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: ユーザーがグループに参加しているか
    } else if (req.query.table === 'checkUser') {
        const userId = req.query.userId;
        const groupId = req.query.groupId;
        pool.query(
            `SELECT * FROM user_group_memberships WHERE group_id = ? AND user_id = ?;
            `, [groupId, userId], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: 新規ノート
    } else if (req.query.table === 'newNote') {
        const groupId = req.query.groupId;
        const noteName = req.query.noteName;
        const userId = req.query.userId;
        pool.query(
            `INSERT INTO notes (title, group_id, created_by, created_at, updated_at)
             VALUES (?, ?, ?, NOW(), NOW());
            `, [noteName, groupId, userId], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                    const noteId = results.insertId;
                }
            }
        );
    // MARK: プライベートグループ
    } else if (req.query.table === 'privateGroup') {
        const userId = req.query.userId;
        pool.query(
            `SELECT * FROM \`groups\` 
             WHERE name = 'プライベート' 
             AND \`delete\` = 0 AND created_by = ?;`, [userId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: ノートの作成
    } else if (req.query.table === 'insertNote') {
        const title = req.query.title;
        const content = req.query.content;
        const groupId = req.query.groupId;
        const userId = req.query.userId;
        pool.query(
            `INSERT INTO notes (title, content, group_id, created_by) VALUES (?, ?, ?, ?);`,
            [title, content, groupId, userId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: ユーザー検索
    } else if (req.query.table === 'suggestUsers') {
        const name = req.query.name;
        pool.query(
            `SELECT id, username
             FROM users
             WHERE username LIKE ? AND \`delete\` = 0
            `, [`%${name}%`],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );  
    // MARK: 検索グループ
    } else if (req.query.table === 'searchGroup') {
        const name = req.query.name;
        pool.query(
            `SELECT id, name, created_by
             FROM \`groups\` 
             WHERE name LIKE ? 
             AND \`delete\` = 0;`,
            [`%${name}%`],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: グループ参加リクエスト
    } else if (req.query.table === 'requestGroup') {
        const fromUserId = req.query.fromUserId;
        const toUserId = req.query.toUserId;
        const groupId = req.query.groupId;
        pool.query(
            `INSERT INTO notifications (user_id, sender_id, group_id, type_id) VALUES (?, ?, ?, 1);`,
            [toUserId, fromUserId, groupId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: グループ招待
    } else if (req.query.table === 'inviteGroup') {
        const groupId = req.query.groupId;
        const inviteUserId = req.query.inviteUserId;
        const userId = req.query.userId;
        pool.query(
            `INSERT INTO notifications (user_id, sender_id, group_id, type_id) VALUES (?, ?, ?, 2);`,
            [inviteUserId, userId, groupId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: グループ参加
    } else if (req.query.table === 'joinGroup') {
        const groupId = req.query.groupId;
        const inviteUserId = req.query.inviteUserId;
        pool.query(
            `INSERT INTO user_group_memberships (user_id, group_id, role_id) VALUES (?, ?, 2);`,
            [inviteUserId, groupId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: 新規グループ
    // TODO 改善するかも
    } else if (req.query.table === 'insertGroup') {
        const name = req.query.name;
        const userId = req.query.userId;
        const memberIds = req.query.memberIds.split(',');

        pool.query(
            `INSERT INTO \`groups\` (name, created_by)
            VALUES (?, ?);
            `, [name, userId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                const groupId = results.insertId;
                Promise.all(memberIds.map(memberId => {
                    if (memberId !== userId) {
                        new Promise((resolve, reject) => {
                            pool.query(
                                `INSERT INTO notifications (user_id, sender_id, group_id, type_id)
                                VALUES (?, ?, ?, 2);
                                `, [memberId, userId, groupId],
                                (err, results) => {
                                    if (err) reject(err);
                                    else resolve(results);
                                }
                            );
                        })
                    } else {
                        pool.query(
                            `INSERT INTO user_group_memberships (user_id, group_id, role_id) VALUES (?, ?, 1);`,
                            [memberId, groupId],
                            (err, results) => {
                                if (err) reject(err);
                                else resolve(results);
                            }
                        );
                    }
                }))
                .then(() => {
                    res.status(200).json({ success: true, groupId });
                })
                .catch(error => {
                    res.status(500).json({ error: error.message });
                });
            }
        );
    // MARK: グループのメンバー
    } else if (req.query.table === 'groupInMember') {
        const groupId = req.query.groupId;
        pool.query(
            `SELECT users.id, users.username, user_group_memberships.role_id
             FROM users
             JOIN user_group_memberships
             ON users.id = user_group_memberships.user_id
             WHERE user_group_memberships.group_id = ? 
             AND user_group_memberships.delete = 0
            `, [groupId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: メンバーの役割変更
    } else if (req.query.table === 'changeRole') {
        const groupId = req.query.groupId;
        const userId = req.query.userId;
        const roleId = req.query.roleId;
        pool.query(
            `UPDATE user_group_memberships
             SET role_id = ?
             WHERE user_id = ? 
             AND group_id = ?
            `, [roleId, userId, groupId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({results});
                }
            }
        );
    // MARK: メンバーの削除
    } else if (req.query.table === 'deleteMember') {
        const groupId = req.query.groupId;
        const userId = req.query.userId;
        pool.query(
            `UPDATE user_group_memberships
             SET \`delete\` = 1
             WHERE user_id = ? AND group_id = ?
            `, [userId, groupId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({results});
                }
            }
        );
    // MARK: メンバーの追加
    } else if (req.query.table === 'addMember') {
        const groupId = req.query.groupId;
        const userId = req.query.userId;
        pool.query(
            `INSERT INTO user_group_memberships (user_id, group_id, role_id)
             VALUES (?, ?, 1)
             ON DUPLICATE KEY UPDATE \`delete\` = 0;
            `, [userId, groupId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({results});
                }
            }
        );
    // MARK: グループの削除
    } else if (req.query.table === 'deleteGroup') {
        const projectId = req.query.projectId;
        pool.query(
            `UPDATE notes
             SET \`delete\` = 1
             WHERE id = ?
            `, [projectId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({results});
                }
            }
        );
    // MARK: グループの役割
    } else if (req.query.table === 'groupRole') {
        const groupId = req.query.groupId;
        pool.query(
            `SELECT roles.id, roles.name, role_permissions.permission_id
             FROM roles
             JOIN group_roles
             ON roles.id = group_roles.role_id
             JOIN role_permissions
             ON roles.id = role_permissions.role_id
             WHERE group_roles.group_id = ? 
             AND roles.delete = 0
            `, [groupId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({results});
                }
            }
        );
    // MARK: 役割の権限
    } else if (req.query.table === 'roleToPermit') {
        const groupId = req.query.groupId;
        pool.query(
            `SELECT roles.id, roles.name, role_permissions.permission_id
             FROM roles
             JOIN group_roles
             ON roles.id = group_roles.role_id
             JOIN role_permissions
             ON roles.id = role_permissions.role_id
             WHERE group_roles.group_id = ? 
             AND roles.delete = 0
            `, [groupId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({results});
                }
            }
        );
    // MARK: 役割の権限の更新
    } else if (req.query.table === 'updateRoleToPermit') {
        const roleId = req.query.roleId;
        const permitId = req.query.permitId;
        pool.query(
            `UPDATE role_permissions
             SET permission_id = ?
             WHERE role_id = ?
            `, [permitId, roleId],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({results});
                }
            }
        );
    // MARK: 権限
    } else if (req.query.table === 'permission') {
        pool.query(
            `SELECT id, name 
             FROM permissions
            `,
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json(results);
                }
            }
        );
    // MARK: 役割の名前の更新
    } else if (req.query.table === 'updateRoleName') {
        const roleId = req.query.roleId;
        const roleName = req.query.roleName;
        pool.query(
            `UPDATE roles
             SET name = ?
             WHERE id = ?
            `, [roleName, roleId], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: 役割の削除
    } else if (req.query.table === 'deleteRole') {
        const roleId = req.query.roleId;
        pool.query(
            `UPDATE roles
             SET \`delete\` = 1
             WHERE id = ?
            `, [roleId], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    // MARK: 役割の追加
    } else if (req.query.table === 'insertRole') {
        const { roleName, groupId, permissionId } = req.query;
            pool.query(
                `INSERT INTO roles (name) VALUES (?);`, 
                [roleName],
                (err, results) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    } else {
                        res.status(200).json({ results });
                        const roleId = results.insertId;
                        pool.query(
                            `INSERT INTO group_roles (group_id, role_id) VALUES (?, ?);`,
                            [groupId, roleId]
                        );
                        pool.query(
                            `INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?);`, 
                            [roleId, permissionId]
                        );
                    }
                }
            );
    } else {
            res.status(400).json({ error: 'Invalid table specified' });
    }
}
