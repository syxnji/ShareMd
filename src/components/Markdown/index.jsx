import styles from "./markdown.module.css"
export function Markdown() {
    return(
        <>
        <div className={styles.markdownContent}>
            <div className={styles.noteInput}>
                <textarea placeholder="Types here..."/>
            </div>

        </div>
        </>
    )
}