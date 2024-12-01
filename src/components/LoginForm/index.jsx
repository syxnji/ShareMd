'use client'

import { useState } from 'react'
import styles from "./login.module.css";
import Link from "next/link";

export default function Login(props) {
  const [mailaddress, setMailaddress] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mailaddress, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(`OK`);
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
        <Link href={"/Register"}>新規登録</Link>
        <p>ログイン</p>
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