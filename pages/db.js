import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'P@ssw0rd',
    database: 'md',
});

export default pool;