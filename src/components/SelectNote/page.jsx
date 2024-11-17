import styles from "./selectNote.module.css"
import Link from "next/link"

export function Notes() {
    return(
        <Link href={"/Editor"} className={styles.link}>
            <div className={styles.note}>
                
                <div className={styles.top}>
                    <div className={styles.title}>
                        <p>
                            Note Title
                        </p>
                    </div>
                    <div className={styles.preview}>
                        <p>
                            This is preview ...
                        </p>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.history}>
                        <p>
                            Last Edited:
                        </p>
                        <p>
                            1 Days ago
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}