'use server'
import pool from "pages/db"


export async function getNotes() {
    try {
        const [rows] = await pool.query(
            `SELECT notes.id, notes.title, notes.content, notes.updated_at, groups.name
             FROM notes 
             JOIN \`groups\` 
               ON notes.group_id = groups.id
             JOIN user_group_memberships
               ON notes.group_id = user_group_memberships.group_id
             WHERE user_id = 1`
        );
        return rows;
    } catch (error) {
        console.error('faild to fetch notes', error);
        return[]
    }
}