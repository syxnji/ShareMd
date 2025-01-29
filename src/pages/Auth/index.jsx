"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bcrypt from "bcryptjs";
import Cookies from "js-cookie";
// styles
import styles from "./auth.module.css";

export default function Auth() {

  // MARK: Toast Settings
  const customToastOptions = {
    position: "top-right",
    autoClose: 2000,
    closeOnClick: true,
    draggable: true,
  };

  const router = useRouter();
  const [toggle, setToggle] = useState("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // MARK: Login
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/db?table=login&email=${email}`);
    const result = await response.json();

    
    // メールアドレスチェック
    if (!result.results || result.results.length === 0) {
      toast.error("メールアドレスまたはパスワードが間違っています", customToastOptions);
      return;
    }

    // パスワードチェック
    const checkPassword = await bcrypt.compareSync(
      password,
      result.results[0].password_hash,
    );

    // パスワードチェック結果
    if (checkPassword) {
      toast.success("ログインに成功しました", customToastOptions);
      Cookies.set("id", result.results[0].id, {
        expires: 3,
        path: "/",
        secure: true,
      });
      router.push("/Library");
      return;

    } else {
      toast.error("メールアドレスまたはパスワードが間違っています", customToastOptions);
      return;

    }
  };

  // MARK: Register
  const handleRegister = async (e) => {
    e.preventDefault();

    // ハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // データベースに登録
    const response = await fetch(
      `/api/post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: "register",
          username: username,
          email: email,
          password: hashedPassword,
        }),
      },
    );
    const result = await response.json();

    // 登録結果
    if (result.success) {
      setToggle("login");
      setPassword("");
      toast.success("登録に成功しました", customToastOptions);
    } else {
      toast.error("登録に失敗しました", customToastOptions);
    }
  };

  // MARK: MAIN
  return (
    <main>
      <div className={styles.auth}>
        <ToastContainer />
        <div className={styles.toggleBtns}>
          <button
            className={toggle === "login" ? styles.trueBtn : styles.falseBtn}
            onClick={() => setToggle("login")}
          >
            ログイン
          </button>
          <button
            className={toggle === "register" ? styles.trueBtn : styles.falseBtn}
            onClick={() => setToggle("register")}
          >
            新規登録
          </button>
        </div>
        <div className={styles.authForm}>
          {toggle === "login" ? (
            <form onSubmit={handleLogin} className={styles.loginForm}>
              <input
                type="text"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit">ログイン</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className={styles.registerForm}>
              <input
                type="text"
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit">登録</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
