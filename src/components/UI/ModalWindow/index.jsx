import styles from "./modalWindow.module.css";

export function ModalWindow({ children }) {
  return <div className={styles.modalWindow}>{children}</div>;
}
