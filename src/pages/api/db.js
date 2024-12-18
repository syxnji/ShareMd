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

        // MARK: SELECT > ユーザー_ノート
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

        // MARK: SELECT > グループ_ノート
    } else if (req.query.table === 'selectedGroup') {
        const selectGroupId = req.query.groupId;
        pool.query(
            `SELECT notes.id, notes.title, notes.content, notes.updated_at, 
             groups.id AS groupId, groups.name AS groupName
             FROM notes
             JOIN \`groups\`
               ON notes.group_id = groups.id
             WHERE notes.group_id = ?
            `, [selectGroupId], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json(results);
                }
            }
        );

        // MARK: SELECT > ロール
    } else if (req.query.table === 'groupRole') {
        const groupId = req.query.groupId;
        pool.query(
            `SELECT roles.id, roles.name, 
             group_roles.group_id, role_permissions.permission_id
             FROM roles 
             JOIN group_roles 
             ON roles.id = group_roles.role_id
             JOIN role_permissions
             ON roles.id = role_permissions.role_id
             WHERE group_roles.group_id = ?
            `, [groupId], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json(results);
                }
            }
        );

        // MARK: SELECT > 権限
    } else if (req.query.table === 'permissions') {
        pool.query(
            `SELECT id, name 
             FROM permissions
             ORDER BY id ASC
            `,
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json(results);
                }
            }
        );

        // MARK: UPDATE > ロール_権限
    } else if (req.query.table === 'updPermission') {
        const newId = req.query.new;
        const id = req.query.id;
        pool.query(
            `UPDATE role_permissions
             SET permission_id = ?
             WHERE role_id = ?
            `, [newId, id], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );

        // MARK: DELETE > ロール
    } else if (req.query.table === 'deleteRole') {
        const id = req.query.id;
        pool.query(
            `DELETE FROM role_permissions 
            WHERE role_id = ?;
            `, [id], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
        pool.query(
            `DELETE FROM group_roles 
            WHERE role_id = ?;
            `, [id], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
        pool.query(
            `DELETE FROM roles 
             WHERE id = ?
            `, [id], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );

        // MARK: INSERT > グループ_ロール_権限
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

        // MARK: SELECT > グループ_ノート
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
            `, 
            [id], 
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
            `, 
            [id], 
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
        const content = req.query.content;
        pool.query(
            `UPDATE notes
             SET 
             title = ?,
             content = ?,
             updated_at = NOW()
             WHERE id = ?;
            `, 
            [title, content, id], 
            (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    } else {
            res.status(400).json({ error: 'Invalid table specified' });
    }
}
