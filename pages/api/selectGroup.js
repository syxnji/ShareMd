'use server'
import pool from "pages/db";

export async function getNotesInGroup(groupId) {
    try {
        const [rows] = await pool.query(
            `SELECT notes.id, notes.title, notes.content, notes.updated_at, groups.name
             FROM notes
             JOIN \`groups\`
               ON notes.group_id = groups.id
             WHERE notes.group_id = ?`,
            [groupId]
        );

        if (rows.length === 0) {
            return { notes: [], groupName: null }; // データがない場合の処理
        }

        const groupName = rows[0].name;
        return { notes: rows ,groupName };
    } catch (error) {
        console.error('faild to fetch notes in group:', error);
        return { notes: [], groupName: null };
    }
}