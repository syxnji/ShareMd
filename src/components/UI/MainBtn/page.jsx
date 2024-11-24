// style
import styles from "./mainbtn.module.css"

export function MainBtn({text,img}) {
    return(
        <button className={styles.mainBtn}>
            {img}
            {text}
        </button>
    )
}