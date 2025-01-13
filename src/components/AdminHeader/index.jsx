import styles from "./adminHeader.module.css";
import Link from "next/link";

export function AdminHeader({setActive}) {
    return (
        <header className={styles.header}>
            <button onClick={() => {
                setActive("dashboard");
            }}>
                Dashboard
            </button>
            <button onClick={() => {
                setActive("system");
            }}>
                System
            </button>
            <button onClick={() => {
                setActive("users");
            }}>
                Users
            </button>
            <button onClick={() => {
                setActive("groups");
            }}>
                Groups
            </button>
            <button onClick={() => {
                setActive("roles");
            }}>
                Roles
            </button>
            <button onClick={() => {
                setActive("notes");
            }}>
                Notes
            </button>
        </header>
    )
}