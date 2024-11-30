'use server'
import pool from "pages/db"


export async function getNotes() {
    try {
        const [rows] = await pool.query(
            `select * 
             from notes 
             join \`groups\` 
               on notes.group_id = groups.id`
        );
        return rows;
    } catch (error) {
        console.error('faild to fetch notes', error);
        return[]
    }
}