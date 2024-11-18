import pool from "../db";

export default async function handler(req, res) {
    console.log('Request Method:', req.method);
    console.log('Request Body:', req.body);

    if (req.method === 'POST') {
        const {username, mailaddress, password} = req.body;

        if (!username || !mailaddress || !password) {
            return res.status(400).json({error: 'api/register nothing data error'})
        }

        try {
            const [result] = await pool.query(
                'INSERT INTO Users (Username, Mailaddress, Password) VALUES (?, ?, ?)',
                [username, mailaddress, password]
            );
            console.log('Insert Id:', result.insertId);
            res.status(200).json({msg: 'inserted !', id: result.insertId});
        } catch (error) {
            console.error('error insert', error);
            res.status(500).json({error: 'cant inserted'});
        }
    } else {
        res.status(405).json({error: 'request method'});
    }
}