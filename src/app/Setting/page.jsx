// style
import styles from "./setting.module.css"

export default function Setting() {
    return(
        <main>
            <div className={styles.settings}>
                <div className={styles.profile}>
                    account
                </div>
                <hr />
                <div className={styles.groups}>
                    groups
                </div>
            </div>
        </main>
    )
}