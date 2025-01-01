import Link from "next/link";
// style
import styles from "./header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <Link href={"/Auth"}>Login</Link>
      <Link href={"/"}>Top</Link>
      <Link href={"/Library"}>Library</Link>
    </header>
  );
}