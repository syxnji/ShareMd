import styles from "./header.module.css";
import Link from "next/link"

export function Header() {
  return (
    <header className={styles.header}>
      <Link href={"/login"}>Login</Link>
      <Link href={"/"}>Top</Link>
      <Link href={"/Library"}>Library</Link>
    </header>
  );
}