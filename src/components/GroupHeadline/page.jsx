// style
import styles from "./groupheadline.module.css"

export function GroupHeadline({ headLeft, headRight }) {
    return(
        <div className={styles.outerHead}>
            <div className={styles.innerHead}>
                {/* <div className={styles.left}>
                    <p className={styles.title}>
                        Marketing Team
                    </p>
                    { headLeft }
                </div>
                { headRight } */}
                <div className={styles.left}>
                    {headLeft}
                </div>
                <div className={styles.right}>
                    {headRight}
                </div>
            </div>
        </div>
    )
}