'use server'
import pool from "pages/db";

export async function getNotesInGroup(selectGroupId) {
    try {
        const [rows] = await pool.query(
            `SELECT notes.id, notes.title, notes.content, notes.updated_at, 
             groups.id AS groupId, groups.name AS groupName
             FROM notes
             JOIN \`groups\`
               ON notes.group_id = groups.id
             WHERE notes.group_id = ?`,
            [selectGroupId]
        );

        if (rows.length === 0) {
            return { notes: [], group: null }; // データがない場合の処理
        }

        const {groupId, groupName} = rows[0];
        return { notes: rows, group: { id: groupId, name: groupName } };
    } catch (error) {
        console.error('faild to fetch notes in group:', error);
        return { notes: [], group: null };
    }
}