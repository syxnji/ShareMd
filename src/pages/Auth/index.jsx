'use client'
import { useState } from "react";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bcrypt from 'bcryptjs';
import Cookies from 'js-cookie';
// styles
import styles from "./auth.module.css";

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
        if (!result.results || result.results.length === 0) {
            toast.error('メールアドレスまたはパスワードが間違っています');
            return;
        }
        const checkPassword = await bcrypt.compareSync(password, result.results[0].password_hash);
        if (checkPassword) {
            toast.success('ログインに成功しました');
            Cookies.set('id', result.results[0].id, { expires: 3, path: '/', secure: true });
            router.push('/Library');
        } else {
            toast.error('メールアドレスまたはパスワードが間違っています');
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
                    <button className={toggle === 'login' ? styles.trueBtn : styles.falseBtn } onClick={() => setToggle('login')}>ログイン</button>
                    <button className={toggle === 'register' ? styles.trueBtn : styles.falseBtn } onClick={() => setToggle('register')}>新規登録</button>
                </div>
                <div className={styles.authForm}>
                    {toggle === 'login' ? (
                        <form onSubmit={handleLogin} className={styles.loginForm}>
                            <input type="text" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                            <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)}  required/>
                            <button type="submit">ログイン</button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className={styles.registerForm}>
                            <input type="text" placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)}  required/>
                            <input type="text" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)}  required/>
                            <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)}  required/>
                            <button type="submit">登録</button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    )
}