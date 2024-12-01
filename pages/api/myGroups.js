'use server'
import pool from "pages/db"

export async function getGroups() {
    try {
        const [rows] = await pool.query(
            `SELECT groups.id, name 
             FROM \`groups\` 
             JOIN user_group_memberships 
               ON groups.id = user_group_memberships.group_id 
             WHERE user_group_memberships.user_id = 1`
        );
        return rows;
    } catch (error) {
        console.error('faild to fetch groups:', error);
        return[]
    }
}