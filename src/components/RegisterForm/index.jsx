'use client'

import { useState } from 'react'
import styles from "./register.module.css";
import Link from "next/link";
import bcrypt from 'bcryptjs';

export default function Register(props) {
  const [username, setUsername] = useState('');
  const [mailaddress, setMailaddress] = useState('');
  const [password, setPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ハッシュ化
    const saltRounds = 10;
    const hashed = bcrypt.hashSync(password, saltRounds);
    setHashedPassword(hashed);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, mailaddress, password: hashed }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(`ID:${data.id} へ登録されました`);
        setUsername('');
        setMailaddress('');
        setPassword('');
      } else {
        console.log(`エラー:${data.error}`);
      }
    } catch (error) {
      setMessage('予期しないエラー');
      console.error(error);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.selectForm}>
        <p>新規登録</p>
        <Link href={"/Login"}>ログイン</Link>
      </div>
      <div className={styles.formContent}>
        <label htmlFor="username" className={styles.label}>Username:</label>
        <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required 
        />
      </div>
      <div className={styles.formContent}>
        <label htmlFor="mailaddress" className={styles.label}>Mailaddress:</label>
        <input
        id="mailaddress"
        type="email"
        value={mailaddress}
        onChange={(e) => setMailaddress(e.target.value)}
        required 
        />
      </div>
      <div className={styles.formContent}>
        <label htmlFor="password" className={styles.label}>Password:</label>
        <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required 
        />
      </div>
      <div className={styles.formContent}>
        <button type='submit'>{props.btn}</button>
      </div>
    </form>
    {/* {message && <p className={styles.message}>{message}</p>} */}
    </>
  );
}