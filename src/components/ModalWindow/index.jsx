// style
import styles from "./modalWindow.module.css"
// icon
import { BsCaretRightFill } from "react-icons/bs"

export function ModalWindow({ msg, name, before, after, No, Yes, content, type }) {
    return(
        <>
        <div className={styles.modal}>

            {/* メッセージ */}
            <p className={styles.message}>{msg}</p>

            {content}

            {/* ロール名 */}
            <div className={styles.modalRole}>
                {name}
            </div>

            {/* 変更内容 */}
            {(before || after) && (
                <div className={styles.changes}>
                    <p className={styles.change}>
                        {before}
                    </p>
                    <BsCaretRightFill />
                    <p className={styles.change}>
                        {after}
                    </p>
                </div>
            )}

            
            {/* ボタン */}
            <div className={styles.modalBtns}>

                <button 
                 className={styles.modalNo} 
                 onClick={No}
                >いいえ</button>

                <button 
                 className={styles.modalYes} 
                 onClick={Yes}
                 type={type}
                >はい</button>
            </div>
        </div>
        </>
    )
}