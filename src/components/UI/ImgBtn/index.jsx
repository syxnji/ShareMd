import styles from "./imgbtn.module.css"

export function ImgBtn({img, click}) {
    return(
        <button className={styles.ImgBtn} onClick={click}>
            {img}
        </button>
    )
}