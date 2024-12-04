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
                    res.status(200).json({ message: 'Permission updated successfully', results });
                }
            }
        );
    } else {
            res.status(400).json({ error: 'Invalid table specified' });
    }
}
