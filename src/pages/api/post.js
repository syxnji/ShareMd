import mysql from 'mysql2/promise'

// データベース接続設定
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // データベース接続
    const connection = await mysql.createConnection(dbConfig)
    
    const { title, content, groupId, userId } = req.body

    // SQLインジェクション対策のためプレースホルダーを使用
    const [result] = await connection.execute(
      'INSERT INTO notes (group_id, title, content, created_by) VALUES (?, ?, ?, ?)',
      [groupId, title, content, userId]
    )

    await connection.end()

    return res.status(200).json({ 
      success: true,
      message: 'データが正常に保存されました',
      data: {
        id: result.insertId,
        title,
        content
      }
    })

  } catch (error) {
    console.error('エラー:', error)
    return res.status(500).json({ 
      success: false,
      message: 'データベースエラーが発生しました',
      error: error.message 
    })
  }
}
