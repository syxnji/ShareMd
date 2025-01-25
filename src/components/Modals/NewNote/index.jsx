import { ModalWindow } from "@/components/UI/ModalWindow";
import { BsX } from "react-icons/bs";
import styles from "./newNote.module.css";

export function NewNoteModal({ 
    allGroups, 
    toggleModalNewNote, 
    handleCreateNote, 
    handleChangeNewNoteGroup, 
    handleChangeNewNoteTitle,
    newNoteTitle,
    setNewNoteTitle,
    setNoteContent,
    handleImport
 }){


    return(
        <ModalWindow>
        <form onSubmit={(e) => {
            e.preventDefault();
            handleCreateNote(e);
        }}>
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
                <div className={styles.import}>
                    <label htmlFor="newNoteImport" className={styles.newNoteLabel}>インポート(任意.md)</label>
                    <input 
                        className={styles.newNoteInput} 
                        type="file" 
                        accept=".md"
                        onChange={handleImport}
                        id="newNoteImport"
                    />
                </div>
                <button 
                    className={styles.newNoteSubmit} 
                    type="submit"
                >
                    作成
                </button>
            </div>
        </form>
        </ModalWindow>
    )
}