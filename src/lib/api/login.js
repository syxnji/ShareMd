import pool from "../../pages/api/db";
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    console.log('Request Method:', req.method);
    console.log('Request Body:', req.body);

    if (req.method === 'POST') {
        const {mailaddress, password} = req.body;

        if(!mailaddress || !password) {
            return res.status(400).json({error: 'api/login nothing data error'})
        }

        try {
            const [result] = await pool.query(
                'SELECT Password FROM Users WHERE Mailaddress = ?',
                [mailaddress]
            );
            console.log('This is result',result)
            if (result.length === 0) {
                return res.status(401).json({error: 'mailaddress notfound'})
            }
            // DBから取得したパスワード
            const storedPasswordHash = result[0].Password;
            const isPasswordValid = bcrypt.compareSync(password, storedPasswordHash);

            if (isPasswordValid) {
                console.log('Login successful');
                return res.status(200).json({ message: 'Login successful', username: result[0].Username });
            } else {
                console.log('Invalid password');
                res.status(401).json({ error: 'Invalid login credentials' });
            }

        } catch (error) {
            console.error('error insert', error);
            res.status(500).json({error: 'cant inserted'});
        }
    } else {
        res.status(405).json({error: 'request method'});
    }
}