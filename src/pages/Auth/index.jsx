'use client'

import { useState } from "react";
import bcrypt from 'bcryptjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./auth.module.css";
import { useRouter } from 'next/router';

export default function Auth() {
    const router = useRouter();
    const [toggle, setToggle] = useState('login');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/db?table=login&email=${email}`);
        const result = await response.json();
        const checkPassword = await bcrypt.compareSync(password, result.results[0].password_hash);
        if (checkPassword) {
            toast.success('ログインに成功しました');
            sessionStorage.setItem('id', result.results[0].id);
            router.push('/Library');
        } else {
            toast.error('ログインに失敗しました');
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await fetch(`/api/db?table=register&username=${username}&email=${email}&password=${hashedPassword}`);
        const result = await response.json();
        if (result.error) {
            toast.error('登録に失敗しました');
        } else {
            toast.success('登録に成功しました');
            setToggle('login');
            setPassword('');
        }
    }

    return (
        <main>
            <div className={styles.auth}>
                <ToastContainer />
                <div className={styles.toggleBtns}>
                    <button className={styles.toggleBtn} onClick={() => setToggle('login')}>ログイン</button>
                    <button className={styles.toggleBtn} onClick={() => setToggle('register')}>新規登録</button>
                </div>
                <div className={styles.authForm}>
                    {toggle === 'login' ? (
                        <div className={styles.loginForm}>
                            <form onSubmit={handleLogin}>
                                <input type="text" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <button type="submit">ログイン</button>
                            </form>
                        </div>
                    ) : (
                        <div className={styles.registerForm}>
                            <form onSubmit={handleRegister}>
                                <input type="text" placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} />
                                <input type="text" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <button type="submit">登録</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}