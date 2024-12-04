// style
import styles from "./modalWindow.module.css"
// icon
import { BsCaretRightFill } from "react-icons/bs"

export function ModalWindow({ permissionName, beforeName, afterName, handleModalNo, handleModalYes }) {
    return(
        <>
        <div className={styles.modal}>
            {/* メッセージ */}
            <p className={styles.message}>本当に変更しますか？</p>

            {/* ロール名 */}
            <div className={styles.modalRole}>
                {permissionName}
            </div>

            {/* 変更内容 */}
            <div className={styles.changes}>
                <p className={styles.change}>
                    {beforeName}
                </p>
                <BsCaretRightFill />
                <p className={styles.change}>
                    {afterName}
                </p>
            </div>
            
            {/* ボタン */}
            <div className={styles.modalBtns}>
                <button 
                 className={styles.modalNo} 
                 onClick={handleModalNo}
                >いいえ</button>
                <button 
                 className={styles.modalYes} 
                 onClick={handleModalYes}
                >はい</button>
            </div>
        </div>
        </>
    )
}