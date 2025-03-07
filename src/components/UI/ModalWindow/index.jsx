import { useEffect } from "react";
import styles from "./modalWindow.module.css";

export function ModalWindow({ children, className }) {
  // モーダルが開いたときに背景スクロールを無効化
  useEffect(() => {
    // スクロールを無効化
    document.body.style.overflow = "hidden";
    
    // クリーンアップ関数
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div className={styles.modalOverlay}></div>
      <div className={`${styles.modalWindow} ${className || ''}`}>
        {children}
      </div>
    </>
  );
}
