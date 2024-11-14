import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePasswords = async (password, hashedPassword) => {
    console.log('比較するパスワード:', password); // 入力されたパスワードを表示
    console.log('保存されているハッシュ化パスワード:', hashedPassword); // データベースに保存されているハッシュ化されたパスワードを表示
    
    return await bcrypt.compare(password, hashedPassword);
  };

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};