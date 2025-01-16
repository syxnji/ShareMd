// component
import { Notes } from "../SelectNote"
// style
import styles from "./notesInGroup.module.css"
import styleNotes from "@/components/SelectNote/selectNote.module.css"

export function NotesInGroup({ notes, isNotesClass, toggleModalNewNote }) {
    return (
        <>
        {/* グリープの選択時と未選択時で表示を切り替え */}
        {notes.length === 0 ? (
            <div className={styles.empty} onClick={() => {
                toggleModalNewNote();
            }}>
                <p className={styles.emptyMain}>ノートがありません</p>
                <p className={styles.emptySub}>ここをクリックでノートを作成</p>
            </div>
        ) : (
            <>
            {/* notes */}
            <div className={isNotesClass ? styles.grid : styles.list}>
                {notes.map((note) => (
                    <Notes
                        className={isNotesClass ? styleNotes.grid : styleNotes.list}
                        key={note.id}
                        id={note.id}
                        title={note.title}
                        preview={note.content}
                        last={new Date(note.updated_at).toLocaleString()}
                    />
                ))}
            </div>
            </>
        )}
        </>
    );
}