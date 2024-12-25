import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'P@ssw0rd',
  database: 'md',
});

// APIリクエストのハンドリング
export default function handler(req, res) {
    if (req.query.table === 'joinedGroups') {
        pool.query(
            `SELECT groups.id, name 
             FROM \`groups\` 
             JOIN user_group_memberships 
               ON groups.id = user_group_memberships.group_id 
             WHERE user_group_memberships.user_id = 1
            `, 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json(results);
                }
            }
        );
    } else if (req.query.table === 'allNotes') {
        pool.query(
            `SELECT notes.id, notes.title, notes.content, notes.updated_at, groups.name
             FROM notes 
             JOIN \`groups\` 
               ON notes.group_id = groups.id
             JOIN user_group_memberships
               ON notes.group_id = user_group_memberships.group_id
             WHERE user_id = 1
            `, 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json(results);
                }
            }
        );
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
    } else if (req.query.table === 'notes') {
        const id = req.query.id;
        pool.query(
            `SELECT notes.id, notes.title
             FROM \`groups\`
             JOIN notes
             ON groups.id = notes.group_id
             WHERE groups.id = ?
            `, [id], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
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
    } else if (req.query.table === 'newNote') {
        const groupId = req.query.groupId;
        const noteName = req.query.noteName;
        pool.query(
            `INSERT INTO notes (title, group_id, created_by, created_at, updated_at)
             VALUES (?, ?, 1, NOW(), NOW());
            `, [noteName, groupId], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    } else if (req.query.table === 'suggestUsers') {
        const name = req.query.name;
        pool.query(
            `SELECT id, username
             FROM users
             WHERE username LIKE ?
            `, [`%${name}%`],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    } else if (req.query.table === 'insertGroup') {
        const name = req.query.name;
        const memberIds = req.query.memberIds.split(',');

        pool.query(
            `INSERT INTO \`groups\` (name, created_at, updated_at)
            VALUES (?, NOW(), NOW());
            `, [name],
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                const groupId = results.insertId;
                Promise.all(memberIds.map(memberId => 
                    new Promise((resolve, reject) => {
                        pool.query(
                            `INSERT INTO user_group_memberships (user_id, group_id, role_id)
                             VALUES (?, ?, 1);
                            `, [memberId, groupId],
                            (err, results) => {
                                if (err) reject(err);
                                else resolve(results);
                            }
                        );
                    })
                ))
                .then(() => {
                    res.status(200).json({ success: true, groupId });
                })
                .catch(error => {
                    res.status(500).json({ error: error.message });
                });
            }
        );
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
    } else if (req.query.table === 'deleteProject') {
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
