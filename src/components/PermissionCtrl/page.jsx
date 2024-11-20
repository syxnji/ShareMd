// style
import styles from "./permission.module.css"
// icon
import { FaMinus } from "react-icons/fa6";

export function PermissionCtrl() {
    return(
        <form action="" method="post">
            <div className={styles.permission}>
                <div className={styles.left}>
                    <div className={styles.role}>
                        <input type="text" placeholder="ロール名(変更)" value="Role Name" />
                    </div>
                    <div className={styles.permit}>
                        <select name="" id="" className={styles.select}>
                            <option value="">閲覧のみ</option>
                            <option value="">編集可能</option>
                            <option value="">全て</option>
                        </select>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.deleteBtn}>
                        <button type="submit"><FaMinus /></button>
                    </div>
                </div>
            </div>
        </form>
    )
}