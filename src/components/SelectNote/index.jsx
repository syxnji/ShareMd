import styles from "./selectNote.module.css";
import Link from "next/link";

export function Notes({className, title, preview, last}) {
    return(
        <Link href={"/Editor"} className={className}>
            <div className={styles.note}>
                
                <div className={styles.top}>
                    <div className={styles.title}>
                        <p>
                            {title}
                        </p>
                    </div>
                    <div className={styles.preview}>
                        <p>
                            {preview} ...
                        </p>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.history}>
                        <p>
                            Last Edited:
                        </p>
                        <p>
                            {last}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}