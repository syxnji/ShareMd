import { ModalWindow } from "@/components/UI/ModalWindow";
import { BsX } from "react-icons/bs";
import styles from "./newNote.module.css";

export function NewNoteModal({ allGroups, toggleModalNewNote, handleCreateNote, handleChangeNewNoteGroup, handleChangeNewNoteTitle, newNoteTitle }){
    return(
        <ModalWindow>
        <form onSubmit={handleCreateNote}>
            {/* 閉じる */}
            <button className={styles.newNoteClose} onClick={toggleModalNewNote}><BsX/></button>
            <div className={styles.newNoteContents}>
                <div className={styles.newNoteGroup}>
                    <label htmlFor="newNoteGroup" className={styles.newNoteLabel}>保存先グループ</label>
                    {/* グループ選択 */}
                    <select className={styles.newNoteGroupSelect} required onChange={handleChangeNewNoteGroup} defaultValue="">
                        <option value="" disabled>選択してください</option>
                        {allGroups.map((group) => (
                            <option key={group.id} value={group.id}>{group.name}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.newNoteTitle}>
                    <label htmlFor="newNoteName" className={styles.newNoteLabel}>ノートタイトル</label>
                    {/* ノートタイトル */}
                    <input className={styles.newNoteInput} type="text" placeholder='ToDo List' onChange={handleChangeNewNoteTitle} value={newNoteTitle} required/>
                </div>
                <button className={styles.newNoteSubmit} type="submit">作成</button>
            </div>
        </form>
        </ModalWindow>
    )
}