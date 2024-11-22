// style
import styles from "./joinedgroup.module.css"
// icon
import { FaMinus } from "react-icons/fa6";

export function JoinedGroup(group) {
    return(
        <form action="">
            <div className={styles.group} key={group.id}>
                <div className={styles.left}>
                    <div className={styles.groupName}>
                        <input type="text" value={group.group} readOnly/>
                    </div>
                    <p className={styles.groupSize}>{group.member} 人</p>
                </div>
                <div className={styles.right}>
                    <button className={styles.button} type="submit">
                        <FaMinus/>
                    </button>
                </div>
            </div>
        </form>
    )
}