import { FiCalendar } from "react-icons/fi";
import styles from "./selectNote.module.css";
import Link from "next/link";

export function Notes({id, className, title, preview, last}) {
    return(
        // <Link href={"/Editor"} className={className}>
        // <Link href={{ pathname: "/Editor/", query: { id } }} className={className}>
        <Link href={`/Editor/${id}`} className={className}>
            <div className={styles.note}>
                <div className={styles.title}>
                    <p>
                        {title}
                    </p>
                </div>
                {className.includes("grid") ? (
                    <div className={styles.preview}>
                        <p>
                            {preview}
                        </p>
                    </div>
                ) : null}
                <div className={styles.history}>
                    <FiCalendar/>
                    <p>
                        {last}
                    </p>
                </div>
            </div>
        </Link>
    )
}