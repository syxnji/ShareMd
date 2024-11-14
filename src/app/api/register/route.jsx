import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { hashPassword } from '../../../../lib/auth';

export async function POST(request) {
  const { name, email, password } = await request.json();

  try {
    const hashedPassword = await hashPassword(password);
    await pool.query('INSERT INTO User (Username, Mailaddress, Password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    return NextResponse.json({ message: 'User registered successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}