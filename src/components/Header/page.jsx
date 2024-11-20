import Link from "next/link";
// style
import styles from "./header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <Link href={"/Register"}>Register</Link>
      <Link href={"/Login"}>Login</Link>
      <Link href={"/"}>Top</Link>
      <Link href={"/Library"}>Library</Link>
      <Link href={"/Permission"}>Permission</Link>
      <Link href={"/Editer"}>Editer</Link>
    </header>
  );
}