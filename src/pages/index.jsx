"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
// style
import styles from "@/styles/index.module.css";
// icon
import { TfiWrite } from "react-icons/tfi";
import { PiFileMdBold, PiSignIn } from "react-icons/pi";
import Cookies from "js-cookie";
import { FaBook } from "react-icons/fa6";

export default function MarkdownEditor() {
  const [noteTitle, setNoteTitle] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("id"));
  }, []);

  return (
    <main>
      <div className={styles.contents}>
        <div className={styles.head}>
          <PiFileMdBold className={styles.headIcon} />
          <p className={styles.headTitle}>ShareMd</p>
          {isLoggedIn ? (
            <Link href={"/Library"} className={styles.headButton}>
              <FaBook />
              Library
            </Link>
          ) : (
            <Link href={"/Auth"} className={styles.headButton}>
              <PiSignIn />
              Sign in
            </Link>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.contentText}>
            <p className={styles.mainText}>Collaborate on Notes Together!</p>
            <p className={styles.subText}>
              ノートを作成し、チーム間で共有できます。新規ノートの作成から始めましょう。
            </p>
          </div>
          <input
            type="text"
            placeholder="Enter note title..."
            className={styles.contentInput}
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />

          {/* <Link href={`/Editor/0?title=${noteTitle}`} className={styles.submitButton}><TfiWrite />Create New Note</Link> */}
          <Link
            href={`/Try?title=${noteTitle}`}
            className={styles.submitButton}
          >
            <PiFileMdBold />
            Create
          </Link>
        </div>
      </div>
    </main>
  );
}
