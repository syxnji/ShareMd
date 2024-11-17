'use client'

import { useState } from 'react'
import styles from "./login.module.css";
import Link from "next/link";

export default function Login(props) {
  const [mailaddress, setMailaddress] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const ここから！！
    }
  }

  return (
    <>
    {/* <form onSubmit={handleSubmit} className={styles.form}> */}
    <form onSubmit="" className={styles.form}>
      <div className={styles.selectForm}>
        <Link href={"/register"}>新規登録</Link>
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