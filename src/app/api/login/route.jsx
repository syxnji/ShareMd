import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { comparePasswords, generateToken } from '../../../../lib/auth';

export async function POST(request) {
    const { email, password } = await request.json();
  
    try {
      const [rows] = await pool.query('SELECT * FROM User WHERE Mailaddress = ?', [email]);
      
      if (rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      const user = rows[0];
      console.log('ユーザー情報:', user); // ユーザー情報の確認
  
      // 正しいカラム名に変更: user.Password
      const isValidPassword = await comparePasswords(password, user.Password);
  
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
  
      const token = generateToken(user.UserId); // UserIdを使用
      return NextResponse.json({ token });
    } catch (error) {
      return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
  }
  