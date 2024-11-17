import styles from "./menu.module.css";
import { BsArrowBarLeft } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";

export function Menu() {
    return(
        <div className={styles.outerMenu}>
            <div className={styles.innerMenu}>
                <div className={styles.top}>
                    <div className={styles.head}>
                        <p>Books</p>
                        <BsArrowBarLeft size={20} />
                    </div>
                    <div className={styles.categories}>
                        <div className={styles.category}>
                            <p>Category ..</p>
                            <div className={styles.notes}>
                                <div className={styles.note}>
                                    <p>予定</p>
                                </div>
                                <div className={styles.note}>
                                    <p>買い物</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.category}>
                            <p>Category ..</p>
                            <div className={styles.notes}>
                                <div className={styles.note}>
                                    <p>予定</p>
                                </div>
                                <div className={styles.note}>
                                    <p>買い物</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.foot}>
                        <IoSettingsOutline color="#fff" />
                        <p>設定</p>
                    </div>
                </div>
            </div>
        </div>
    )
}